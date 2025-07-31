import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [
    {
      id: 1,
      name: 'Butter Chicken',
      description: 'Creamy tomato-based curry with tender chicken pieces',
      price: 15.99,
      originalPrice: 18.99,
      time: 25,
      veg: false,
      available: false,
      category: 'Curry',
      image: 'https://yourcdn.com/images/butter-chicken.jpg'
    },
    {
      id: 2,
      name: 'Vegetable Biryani',
      description: 'Aromatic basmati rice with mixed vegetables and spices',
      price: 14.99,
      time: 30,
      veg: true,
      available: true,
      category: 'Biryani',
      image: 'https://yourcdn.com/images/veg-biryani.jpg'
    }
  ]
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    addMenuItem: (state, action) => {
      state.items.push(action.payload);
    },
    updateMenuItem: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    deleteMenuItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    toggleAvailability: (state, action) => {
  const index = state.items.findIndex(item => item.id === action.payload);
  if (index !== -1) {
    state.items[index].available = !state.items[index].available;
  }
}
  }
});
export const { addMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability } = menuSlice.actions;
export default menuSlice.reducer;
