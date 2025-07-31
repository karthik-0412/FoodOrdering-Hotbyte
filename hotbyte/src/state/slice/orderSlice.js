// src/state/slice/orderSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [], // now starts empty
  search: '',
  status: 'All Status',
  restaurant: 'All Restaurants',
  pagination: { first: 0, rows: 5 }
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders(state, action) {
      state.orders = action.payload;
    },
    setSearch(state, action) {
      state.search = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    setRestaurant(state, action) {
      state.restaurant = action.payload;
    },
    setPagination(state, action) {
      state.pagination = action.payload;
    }
  }
});

export const { setOrders, setSearch, setStatus, setRestaurant, setPagination } = orderSlice.actions;
export default orderSlice.reducer;
