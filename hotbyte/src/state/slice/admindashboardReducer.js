import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchDashboardData = createAsyncThunk(
  'admindashboard/fetchDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:9002/api/admin/dashboard', {
        headers: {authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error fetching dashboard data');
    }
  }
);

const admindashboardSlice = createSlice({
  name: 'admindashboard',
  initialState: {
    users: 0,
    restaurants: 0,
    orders: 0,
    revenue: 0,
    menuItems: 0,
    avgOrderValue: 0,
    commission: 0,
    recentOrders: [],
    restaurantStatus: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        Object.assign(state, { ...action.payload, loading: false });
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default admindashboardSlice.reducer;
