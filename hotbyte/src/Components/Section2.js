import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';

export default function Section2() {
    const restaurants = [
        {
            name: 'Classic Cheeseburger',
            description: 'Juicy beef patty with melted cheese, tomato, and special sauce',
            image: '/services/Photos/burger.jpg',
            price: '₹280',
            originalPrice: '₹300',
            offer: '25% Off',
            rating: 4,
            location: 'Burger Palace'
        },
        {
            name: 'Margherita Pizza',
            description: 'Fresh mozzarella, tomato sauce, and basil on crispy crust',
            image: '/services/Photos/pic3.jpg',
            price: '₹169',
            originalPrice: '₹300',
            offer: '25% Off',
            rating: 3,
            location: 'Pizza Corner'
        },
        {
            name: 'Chicken Biryani',
            description: 'Aromatic basmati rice with tender chicken and traditional spices',
            image: '/services/Photos/pic2.jpg',
            price: '₹149',
            originalPrice: '₹300',
            offer: '25% Off',
            rating: 3,
            location: 'Spice Garden'
        },
        
        // {
        //     name: 'Paneer Tikka',
        //     description: 'Grilled paneer cubes marinated with spices',
        //     image: '/services/Photos/paneer.jpg',
        //     price: '₹180',
        //     originalPrice: '₹220',
        //     offer: '20% Off',
        //     rating: 5,
        //     location: 'Veggie Delight'
        // }
    ];

    return (
        <div className="featured-restaurants" style={{ padding: '40px', background: '#fff7ee' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '5.5vh' }}>
                Featured Restaurants
            </h2>

            <div className="restaurant-grid">
                {restaurants.map((res, index) => (
                    <Card
                        key={index}
                        title={res.name}
                        subTitle={
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <i className="pi pi-map-marker" style={{ color: 'orange' }}></i>
                                {res.location}
                            </span>
                        }
                        header={
                            <div style={{ position: 'relative' }}>
                                <img
                                    src={res.image}
                                    alt={res.name}
                                    style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                                />
                                {res.offer && (
                                    <span
                                        style={{
                                            position: 'absolute',
                                            top: '10px',
                                            left: '10px',
                                            background: 'orange',
                                            color: '#fff',
                                            padding: '3px 7px',
                                            borderRadius: '9px',
                                            fontSize: '0.8rem'
                                        }}
                                    >
                                        {res.offer}
                                    </span>
                                )}
                            </div>
                        }
                        footer={
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <div>
                                    <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                        {res.price}
                                    </span>
                                    {res.originalPrice && (
                                        <span
                                            style={{
                                                textDecoration: 'line-through',
                                                color: '#888',
                                                marginLeft: '5px',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            {res.originalPrice}
                                        </span>
                                    )}
                                </div>
                                <Button
                                    icon="pi pi-plus"
                                    label="Add"
                                    className="p-button-sm"
                                    style={{
                                        background: 'orange',
                                        border: 'none'
                                    }}
                                />
                            </div>
                        }
                        style={{ overflow: 'hidden' }}
                    >
                        <Rating value={res.rating} readOnly stars={5} cancel={false} />
                        <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem' }}>{res.description}</p>
                    </Card>
                ))}
            </div>

            {/* Embedded CSS for grid responsiveness */}
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
