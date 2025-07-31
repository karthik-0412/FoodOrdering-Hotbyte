import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { AutoComplete } from 'primereact/autocomplete';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import axios from 'axios';

export default function MenuManagement() {
    const [menu, setMenu] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const [category, setCategory] = useState('All Categories');
    const [dietary, setDietary] = useState('All');
    const [restaurant, setRestaurant] = useState('All Restaurants');
    const [priceRange, setPriceRange] = useState([0, 500]);
    const [priceRangeLabel, setPriceRangeLabel] = useState('All');
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        axios.get("http://localhost:9002/api/menu/menus", { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then((resp) => setMenu(resp.data))
            .catch(err => console.log(err));
    }, []);

    const uniqueRestaurants = ['All Restaurants', ...Array.from(new Set(menu.map(m => m.restaurant?.restaurantName).filter(Boolean)))];
    const uniqueCategories = ['All Categories', ...Array.from(new Set(menu.map(m => m.category?.categoryName).filter(Boolean)))];
    const dietaryOptions = ['All', 'Veg', 'Non-Veg'];

    const handlePriceFilter = (value) => {
        setPriceRangeLabel(value);
        switch (value) {
            case 'Under ₹100': setPriceRange([0, 100]); break;
            case '₹100 - ₹200': setPriceRange([100, 200]); break;
            case 'Above ₹200': setPriceRange([200, 500]); break;
            default: setPriceRange([0, 500]);
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setCategory('All Categories');
        setDietary('All');
        setRestaurant('All Restaurants');
        setPriceRange([0, 500]);
        setPriceRangeLabel('All');
    };

    const searchItems = (event) => {
        const query = event.query.toLowerCase();
        const results = menu.filter(m => m.itemName.toLowerCase().includes(query)).map(m => m.itemName);
        setFilteredItems(results);
    };

    const filteredMenu = menu.filter(m => {
        const matchesSearch = searchTerm === '' || m.itemName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = category === 'All Categories' || m.category?.categoryName === category;
        const matchesDietary = dietary === 'All' || m.dietaryInfo === dietary;
        const matchesRestaurant = restaurant === 'All Restaurants' || m.restaurant?.restaurantName === restaurant;
        const matchesPrice = m.price >= priceRange[0] && m.price <= priceRange[1];
        return matchesSearch && matchesCategory && matchesDietary && matchesRestaurant && matchesPrice;
    });

    return (
        <div style={{ padding: '40px', background: '#fff7ee', minHeight: '150vh' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '5.5vh' }}>Our Menu</h2>
            <p style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2.5vh' }}>Discover delicious food from our partner restaurants</p>

            {/* Summary Cards */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '30px' }}>
                <div style={summaryCardStyle('#eef6ff')}>
                    <h4>Total Items</h4>
                    <p style={cardValueStyle}>{filteredMenu.length}</p>
                </div>
                <div style={summaryCardStyle('#e6f4ea')}>
                    <h4>Vegetarian</h4>
                    <p style={cardValueStyle}>{filteredMenu.filter(i => i.dietaryInfo === 'Veg').length}</p>
                </div>
                <div style={summaryCardStyle('#fdecea')}>
                    <h4>Non-Vegetarian</h4>
                    <p style={cardValueStyle}>{filteredMenu.filter(i => i.dietaryInfo === 'Non-Veg').length}</p>
                </div>
                <div style={summaryCardStyle('#fff7e6')}>
                    <h4>Available</h4>
                    {/* <p style={cardValueStyle}>{filteredMenu.filter(i => i.availability === 'Available').length}</p> */}
                    <p style={cardValueStyle}>
                        {filteredMenu.filter(i => i.availability?.toLowerCase().trim() === 'available').length}
                    </p>

                </div>
                <div style={summaryCardStyle('#f3e8fd')}>
                    <h4>Avg Price</h4>
                    <p style={cardValueStyle}>
                        ₹{filteredMenu.length > 0
                            ? (filteredMenu.reduce((sum, i) => sum + i.price, 0) / filteredMenu.length).toFixed(2)
                            : '0.00'}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' }}>
                <AutoComplete
                    value={searchTerm}
                    suggestions={filteredItems}
                    completeMethod={searchItems}
                    onChange={(e) => setSearchTerm(e.value)}
                    placeholder="Search for food, restaurants..."
                    style={{ flex: '1 1 250px' }}
                    inputStyle={{ width: '20vw' }}
                />
                <Dropdown value={restaurant} options={uniqueRestaurants.map(r => ({ label: r, value: r }))} onChange={(e) => setRestaurant(e.value)} style={{ flex: '1 1 150px' }} />
                <Dropdown value={category} options={uniqueCategories.map(c => ({ label: c, value: c }))} onChange={(e) => setCategory(e.value)} style={{ flex: '1 1 150px' }} />
                <Dropdown value={dietary} options={dietaryOptions.map(d => ({ label: d, value: d }))} onChange={(e) => setDietary(e.value)} style={{ flex: '1 1 100px' }} />
                <Dropdown value={priceRangeLabel} options={[
                    { label: 'All Prices', value: 'All' },
                    { label: 'Under ₹100', value: 'Under ₹100' },
                    { label: '₹100 - ₹200', value: '₹100 - ₹200' },
                    { label: 'Above ₹200', value: 'Above ₹200' }
                ]} onChange={(e) => handlePriceFilter(e.value)} style={{ flex: '1 1 150px' }} />
                <Button label="Clear Filters" onClick={clearFilters} className="p-button-outlined" style={{ flex: '1 1 120px' }} />
            </div>

            {/* Cards */}
            <div className="restaurant-grid">
                {filteredMenu.map((m, i) => (
                    <Card
                        key={i}
                        title={m.itemName}
                        subTitle={
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <i className="pi pi-map-marker" style={{ color: 'orange' }}></i>
                                {m.restaurant?.location}
                                <span style={{ backgroundColor: 'lightgray', color: 'black', padding: '3px 7px', borderRadius: '9px', fontSize: '0.8rem' }}>
                                    {m.category?.categoryName}
                                </span>
                                <span style={{
                                    backgroundColor: m.dietaryInfo === 'Veg' ? '#32cf30' : 'red',
                                    color: '#fff', padding: '3px 7px', borderRadius: '9px', fontSize: '0.8rem'
                                }}>
                                    {m.dietaryInfo}
                                </span>
                            </span>
                        }
                        header={
                            <div style={{ position: 'relative' }}>
                                <img src={m.imageUrl || '/default.jpg'} alt={m.itemName} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                                {m.offer > 0 && (
                                    <span style={{
                                        position: 'absolute', top: '10px', left: '10px',
                                        background: 'orange', color: '#fff', padding: '3px 7px',
                                        borderRadius: '9px', fontSize: '0.8rem'
                                    }}>{m.offer}% Off</span>
                                )}
                                <span style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    backgroundColor: m.availability?.toLowerCase() === 'available' ? '#32cf30' : 'red',
                                    color: '#fff',
                                    padding: '3px 7px',
                                    borderRadius: '9px',
                                    fontSize: '0.8rem'
                                }}>
                                    {m.availability?.charAt(0).toUpperCase() + m.availability?.slice(1)}
                                </span>
                            </div>
                        }
                        footer={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>₹{m.price}</span>
                                    {m.offer > 0 && m.originalPrice && (
                                        <span style={{ textDecoration: 'line-through', color: '#888', marginLeft: '5px', fontSize: '0.9rem' }}>
                                            ₹{m.originalPrice}
                                        </span>
                                    )}
                                </div>
                                <Button icon="pi pi-eye" label="View" className="p-button-sm p-button-outlined"
                                    style={{ color: 'black', borderColor: 'black' }}
                                    onClick={() => {
                                        setSelectedItem(m);
                                        setModalVisible(true);
                                    }}
                                />
                            </div>
                        }
                    >
                        <Rating value={m.rating} readOnly stars={5} cancel={false} />
                        <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem' }}>{m.description}</p>
                    </Card>
                ))}
            </div>

            {/* Dialog */}
            <Dialog
                header={selectedItem?.itemName}
                visible={modalVisible}
                style={{ width: '700px', maxWidth: '95vw' }}
                modal
                onHide={() => setModalVisible(false)}
            >
                {selectedItem && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                            <div style={{ flex: '1 1 250px' }}>
                                <img src={selectedItem.imageUrl} alt={selectedItem.itemName}
                                    style={{ width: '85%', borderRadius: '8px', height: '35vh' }} />
                            </div>
                            <div style={{ flex: '2 1 300px' }}>
                                <h2>{selectedItem.itemName}</h2>
                                <p>{selectedItem.description}</p>
                                {selectedItem.restaurant?.restaurantName && (
                                    <p><strong>Restaurant:</strong> {selectedItem.restaurant?.restaurantName}</p>

                                )}

                                {selectedItem.restaurant?.addressdto?.street && (
                                    <p>
                                        <strong>Address:</strong> {selectedItem.restaurant?.addressdto?.street}, {selectedItem.restaurant?.location}
                                    </p>

                                )}

                                {selectedItem.category?.categoryName && (
                                    <p><strong>Category:</strong> {selectedItem.category?.categoryName}</p>

                                )}
                                <p><strong>Status:</strong> {selectedItem.restaurant?.status}</p>
                                <p><strong>Owner:</strong> {selectedItem.restaurant?.userdto?.email}</p>


                                <p><strong>Price:</strong> ₹{selectedItem.price}</p>
                                <p><strong>Cooking Time:</strong> {selectedItem.cookingTime} mins</p>
                                <p><strong>Dietary:</strong>
                                    <span style={{
                                        background: selectedItem.dietaryInfo === 'Veg' ? 'lightgreen' : '#f64343ff',
                                        color: 'white', borderRadius: '6px', padding: '2px 6px', marginLeft: '5px'
                                    }}>{selectedItem.dietaryInfo}</span>
                                </p>
                                <p><strong>Availability:</strong>{' '}
                                    <span style={{
                                        background: selectedItem.availability?.toLowerCase() === 'available' ? 'lightgreen' : '#f64343ff',
                                        color: 'white',
                                        borderRadius: '6px',
                                        padding: '2px 6px',
                                        marginLeft: '5px'
                                    }}>
                                        {selectedItem.availability
                                            ? selectedItem.availability.charAt(0).toUpperCase() + selectedItem.availability.slice(1)
                                            : 'Unknown'}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3>Nutritional Info</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px', background: '#f9f9f9', padding: '10px', borderRadius: '8px' }}>
                                <div><strong>Calories:</strong> {selectedItem.calories}</div>
                                <div><strong>Proteins:</strong> {selectedItem.proteins}g</div>
                                <div><strong>Fats:</strong> {selectedItem.fats}g</div>
                                <div><strong>Carbs:</strong> {selectedItem.carbs}g</div>
                            </div>
                        </div>

                        <div>
                            <h3>Ingredients</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', background: '#f9f9f9', padding: '10px', borderRadius: '8px' }}>
                                {(String(selectedItem.ingredients).split(',')).map((ing, i) => (
                                    <span key={i} style={{ background: '#e0e0e0', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem' }}>{ing.trim()}</span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3>Additional Info</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
                                <div><strong>Taste:</strong> {selectedItem.tasteInfo}</div>
                                <div><strong>Availability Time:</strong> {selectedItem.availabilityTime}</div>
                                <div><strong>Added On:</strong> {selectedItem.addedOn}</div>
                            </div>
                        </div>
                    </div>
                )}
            </Dialog>

            <style jsx>{`
                .restaurant-grid {
                    display: grid;
                    grid-template-columns: repeat(1, 1fr);
                    gap: 25px;
                }
                @media (min-width: 600px) {
                    .restaurant-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                @media (min-width: 900px) {
                    .restaurant-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }
            `}</style>
        </div>
    );
}

// 🔽 Helper Styles
const summaryCardStyle = (bgColor) => ({
    flex: '1 1 150px',
    background: bgColor,
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    textAlign: 'center'
});

const cardValueStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold'
};
