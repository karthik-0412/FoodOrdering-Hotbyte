import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  restaurants: [
    {
      id: 1,
      name: 'Spice Garden',
      rating: 4.5,
      location: '123 Main St, Downtown',
      contact: '+1234567890',
      email: 'contact@spicegarden.com',
      description: 'Authentic Indian cuisine with modern twist',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Pizza Palace',
      rating: 4.3,
      location: '456 Oak Ave, Midtown',
      contact: '+1234567891',
      email: 'info@pizzapalace.com',
      description: 'Wood-fired pizzas and Italian classics',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Burger Barn',
      rating: 4.7,
      location: '789 Pine Rd, Uptown',
      contact: '+1234567892',
      email: 'hello@burgerbarn.com',
      description: 'Gourmet burgers and American favorites',
      status: 'Inactive',
    },
  ],
};

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    toggleStatus: (state, action) => {
  const id = action.payload;
  const restaurant = state.restaurants.find(r => r.id === id);
  if (restaurant) {
    restaurant.status = restaurant.status === 'Active' ? 'Inactive' : 'Active';
  }
},

    deleteRestaurant: (state, action) => {
      state.restaurants = state.restaurants.filter(r => r.id !== action.payload);
    },
    addRestaurant: (state, action) => {
  state.restaurants.push(action.payload);
},
updateRestaurant: (state, action) => {
  const updated = action.payload;
  const index = state.restaurants.findIndex(r => r.id === action.payload.id);
  if (index !== -1) {
    state.restaurants[index] = updated;
  }
},
  },
});

export const { toggleStatus, deleteRestaurant, addRestaurant, updateRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;
