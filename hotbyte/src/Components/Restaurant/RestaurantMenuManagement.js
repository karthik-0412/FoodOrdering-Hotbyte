import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { addMenuItem, updateMenuItem, deleteMenuItem } from '../state/slice/menuSlice';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Eye, EyeOff, Trash2, Pencil } from 'lucide-react';
import { addMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability } from '../../state/slice/menuSlice';
import { InputTextarea } from 'primereact/inputtextarea';
import axios from 'axios';

export default function RestaurantMenuManagement() {
  // const menuItems = useSelector((state) => state.menu.items);
  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showDialog, setShowDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  // const [selectedCategory, setSelectedCategory] = useState('All');
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:9002/api/category/get');
        const activeCategories = response.data.filter(c => c.status === 'Active');
        setCategoryList(activeCategories);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    fetchMenuItems();
  }, []);
  const fetchMenuItems = async () => {
    try {
      const res = await axios.get('http://localhost:9002/api/menu/menu');
      setMenuItems(res.data);
    } catch (err) {
      console.error("Failed to fetch menu items", err);
    }
  };
  // const restaurantId = parseInt(localStorage.getItem('restaurantId'));

  const handleSave = async () => {
    const restaurantId = parseInt(localStorage.getItem("restaurantId"));

    if (isNaN(restaurantId)) {
      alert("Invalid or missing restaurant ID. Please log in again.");
      return;
    }

    const payload = {
      ...(editingItem ? { menuId: formData.menuId } : {}),
      itemName: formData.name, // map correctly
      description: formData.description,
      price: formData.price,
      originalPrice: formData.originalPrice,
      offer: formData.offer,
      imageUrl: formData.image, // ✅ use this field only
      dietaryInfo: formData.veg === true || formData.veg === "Veg" ? "Veg" : "Non-Veg",
      tasteInfo: formData.taste,
      cookingTime: formData.time,
      calories: formData.calories,
      fats: formData.fats,
      proteins: formData.proteins,
      carbs: formData.carbs,
      ingredients: formData.ingredients,
      availability: formData.available ? 'available' : 'unavailable',
      availabilityTime: '10:00 AM - 10:00 PM',
      addedOn: new Date().toISOString().split("T")[0],
      category: {
        categoryId: formData.category
      },
      restaurant: {
        restaurantId
      }
    };



    console.log("Payload", payload);

    try {
      if (editingItem) {
        await axios.put(`http://localhost:9002/api/menu/update/${formData.menuId}`, payload);
      } else {
        await axios.post('http://localhost:9002/api/menu/add', payload);
      }

      setShowDialog(false);
      fetchMenuItems();
    } catch (err) {
      console.error("Failed to save item", err);
      alert("Failed to save item. Check console.");
    }
  };



  // const handleDelete = (menuId) => {
  //   console.log("Deleting item with ID:", menuId); // Debug log
  //   if (!menuId) {
  //     console.error("Invalid item ID passed to delete.");
  //     return;
  //   }

  //   axios.delete(`http://localhost:9002/api/menu/${menuId}`)
  //     .then(() => {
  //       console.log("Deleted successfully");
  //       fetchMenuItems();// Refresh logic here (e.g., fetchMenuItems())
  //     })
  //     .catch((err) => {
  //       console.error("Failed to delete item", err);
  //     });
  // };]
  const handleDelete = async (id) => {
    try {
      console.log("Deleting item with ID:", id); // ✅ Confirm ID is valid
      await axios.delete(`http://localhost:9002/api/menu/menu/${id}`);
      console.log("Deleted successfully");
      fetchMenuItems();
      // Optionally refresh the menu items list after delete
    } catch (error) {
      console.error("Failed to delete item", error);
    }
  };







  const emptyItem = {
    menuId: null,
    name: '',
    category: '',
    description: '',
    price: 0,
    originalPrice: 0,
    offer: 0,
    imageUrl: '',
    veg: 'Veg',
    taste: '',
    time: 15,
    ingredients: '',
    calories: 0,
    fats: 0,
    proteins: 0,
    carbs: 0,
    available: true
  };


  const [formData, setFormData] = useState(emptyItem);

  const categories = ['All', 'Main Course', 'Appetizer', 'Dessert'];

  const filteredItems = menuItems.filter((item) => {
    const name = item.name || '';
    const matchesSearch = name.toLowerCase().includes(searchText.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || item.category?.categoryName === selectedCategory;


    return matchesSearch && matchesCategory;
  });


  const openDialog = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        menuId: item.menuId || null,
        name: item.itemName || '',
        description: item.description || '',
        category: item.category?.categoryId || '',
        price: item.price || 0,
        originalPrice: item.originalPrice || 0,
        offer: item.offer || 0,
        imageUrl: item.imageUrl || '',
        veg: item.veg === 'Non-Veg' ? 'Non-Veg' : 'Veg',
        taste: item.taste || '',
        time: item.cookingTime || 15,
        ingredients: item.ingredients || '',
        calories: item.calories || 0,
        fats: item.fats || 0,
        proteins: item.proteins || 0,
        carbs: item.carbs || 0,
        available: item.availability === 'available'
      });
    } else {
      setEditingItem(null);
      setFormData({ ...emptyItem });
    }

    setShowDialog(true);
  };


  const handleToggleAvailability = async (id) => {
    try {
      const res = await axios.put(`http://localhost:9002/api/menu/${id}/toggleAvailability`);
      console.log("Toggle success:", res.data);
      fetchMenuItems(); // <- this should refresh the list with updated data
    } catch (err) {
      console.error("Failed to toggle availability", err.response?.data || err.message);
    }
  };






  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>Menu Management</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>Manage your restaurant's menu items</p>

      {/* Controls */}
      <div style={{
        display: 'flex', gap: '1rem', alignItems: 'center',
        backgroundColor: '#fff', padding: '1rem', borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1.5rem', flexWrap: 'wrap'
      }}>
        <InputText
          placeholder="Search menu items..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ flex: 1, minWidth: '200px' }}
        />

        <Dropdown
          value={selectedCategory}
          options={[{ label: 'All', value: 'All' }, ...categoryList.map(c => ({ label: c.categoryName, value: c.categoryName }))]}
          onChange={(e) => setSelectedCategory(e.value)}
          style={{ minWidth: '150px' }}
        />

        <Button label="More Filters" icon="pi pi-filter" outlined style={{ backgroundColor: '#f1f2f4' }} />
        <Button label="Add New Item" icon="pi pi-plus" style={{ backgroundColor: '#ff6600', color: '#fff' }}
          onClick={() => openDialog()} />
      </div>

      {/* Menu Cards */}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
        {filteredItems.map(item => (
          <div
            key={item.menuId}
            style={{
              width: '300px',
              backgroundColor: '#fff',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              position: 'relative'
            }}
          >
            <div style={{ position: 'relative' }}>
              <img
                src={item.imageUrl}
                alt={item.name}
                style={{ width: '100%', height: '180px', objectFit: 'cover' }}
              />

              {item.availability?.toLowerCase() !== 'available' && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}
                >
                  Out of Stock
                </div>
              )}

              


              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: item.availability === 'available' ? '#4caf50' : '#999',
                  borderRadius: '50%',
                  padding: '6px',
                  cursor: 'pointer'
                }}
                onClick={() => handleToggleAvailability(item.menuId)}
                title={item.availability === 'available' ? 'Mark as Out of Stock' : 'Mark as Available'}
              >
                {item.availability === 'available' ? (
                  <Eye size={16} color="#fff" />
                ) : (
                  <EyeOff size={16} color="#fff" />
                )}
              </div>
            </div>

            <div style={{ padding: '1rem' }}>
              <div style={{ fontWeight: '600' }}>{item.itemName}</div>
              {console.log('Item veg:', item?.dietaryInfo)}

              <span style={{
                color: item.dietaryInfo && item.dietaryInfo.trim().toLowerCase() === 'veg' ? 'green' : 'red',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {item.dietaryInfo && item.dietaryInfo.trim().toLowerCase() === 'veg' ? 'Veg' : 'Non-Veg'}
              </span>


              <p style={{ fontSize: '13px', color: '#555' }}>{item.description}</p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#ff6600', fontWeight: 'bold' }}>₹{item.price}</span>
                {item.originalPrice > item.price && (
                  <span style={{ textDecoration: 'line-through', color: '#999' }}>
                    ₹{item.originalPrice}
                  </span>
                )}
                <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#888' }}>
                  {item.cookingTime} min
                </span>
              </div>

              <div style={{ display: 'flex', marginTop: '1rem', gap: '0.5rem' }}>
                <Button
                  icon={<Pencil size={16} />}
                  label="Edit"
                  outlined
                  onClick={() => openDialog(item)}
                  style={{ flex: 1 }}
                />
                <Button
                  icon={<Trash2 size={16} />}
                  className="p-button-danger"
                  style={{ backgroundColor: '#ff4d4f', color: '#fff' }}
                  onClick={() => handleDelete(item.menuId)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* Add/Edit Dialog */}
      <Dialog
        header={editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
        visible={showDialog}
        style={{ width: '600px' }}
        onHide={() => setShowDialog(false)}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Button
              label="Cancel"
              onClick={() => setShowDialog(false)}
              className="p-button-text"
            />
            <Button
              label={editingItem ? 'Update Item' : 'Add Item'}
              style={{ backgroundColor: '#ff6600', color: '#fff', border: 'none' }}
              onClick={handleSave}
            />
          </div>
        }
      >
        <div style={{ display: 'grid', gap: '1rem' }}>
          {/* Row 1 */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label>Item Name</label>
              <InputText
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter item name"
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Category</label>
              <Dropdown
                value={formData.category}
                options={categoryList.map(c => ({ label: c.categoryName, value: c.categoryId }))}
                onChange={(e) => setFormData({ ...formData, category: e.value })}
                style={{ width: '100%' }}
              />

            </div>
          </div>

          {/* Description */}
          <div>
            <label>Description</label>
            <InputTextarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description"
              style={{ width: '100%' }}
            />
          </div>

          {/* Prices */}
          
          {/* Prices & Offer */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label>Original Price (₹)</label>
              <InputText
                value={formData.originalPrice}
                onChange={(e) => {
                  const originalPrice = parseFloat(e.target.value) || 0;
                  const discount = formData.offer || 0;
                  const price = originalPrice - (originalPrice * discount / 100);
                  setFormData({
                    ...formData,
                    originalPrice,
                    price: parseFloat(price.toFixed(2))
                  });
                }}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Offer (%)</label>
              <InputText
                value={formData.offer}
                onChange={(e) => {
                  const offer = parseFloat(e.target.value) || 0;
                  const originalPrice = formData.originalPrice || 0;
                  const price = originalPrice - (originalPrice * offer / 100);
                  setFormData({
                    ...formData,
                    offer,
                    price: parseFloat(price.toFixed(2))
                  });
                }}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Discounted Price (₹)</label>
              <InputText
                value={formData.price}
                disabled
                style={{ width: '100%', backgroundColor: '#f1f1f1' }}
              />
            </div>
          </div>

          {/* Image */}
          <div>
            <label>Image URL</label>
            <InputText
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
              style={{ width: '100%' }}
            />
          </div>

          {/* Dietary Info / Taste / Time */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label>Dietary Info</label>
              <Dropdown
                value={formData.veg ? 'Veg' : 'Non-Veg'}
                options={[
                  { label: 'Vegetarian', value: 'Veg' },
                  { label: 'Non-Vegetarian', value: 'Non-Veg' }
                ]}
                onChange={(e) => setFormData({ ...formData, veg: e.value === 'Veg' })}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Taste Info</label>
              <InputText
                value={formData.taste}
                onChange={(e) => setFormData({ ...formData, taste: e.target.value })}
                placeholder="e.g., Spicy, Mild"
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Cooking Time (min)</label>
              <InputText
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: parseInt(e.target.value) || 0 })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label>Ingredients (comma separated)</label>
            <InputText
              value={formData.ingredients}
              onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              placeholder="e.g., Chicken, Tomatoes, Spices"
              style={{ width: '100%' }}
            />
          </div>

          {/* Nutritional Info */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label>Calories</label>
              <InputText
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) || 0 })}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Fats (g)</label>
              <InputText
                value={formData.fats}
                onChange={(e) => setFormData({ ...formData, fats: parseInt(e.target.value) || 0 })}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Proteins (g)</label>
              <InputText
                value={formData.proteins}
                onChange={(e) => setFormData({ ...formData, proteins: parseInt(e.target.value) || 0 })}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Carbs (g)</label>
              <InputText
                value={formData.carbs}
                onChange={(e) => setFormData({ ...formData, carbs: parseInt(e.target.value) || 0 })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Availability */}
          <div>
            <label>
              <input
                type="checkbox"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                style={{ marginRight: '8px' }}
              />
              Available for ordering
            </label>
          </div>
        </div>

      </Dialog>
    </div>
  );
}
