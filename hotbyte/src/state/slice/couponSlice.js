import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [
    {
      id: 1,
      name: 'Welcome Offer',
      code: 'WELCOME20',
      description: '20% off on your first order',
      discount: '20% OFF',
      minOrder: 25,
      maxDiscount: 10,
      usage: 45,
      usageLimit: 100,
      expiry: '12/31/2024',
      status: 'expired',
    },
    {
      id: 2,
      name: 'Flat $5 Off',
      code: 'SAVE5',
      description: '$5 off on orders above $30',
      discount: '$5 OFF',
      minOrder: 30,
      maxDiscount: 8,
      usage: 89,
      usageLimit: 200,
      expiry: '12/31/2024',
      status: 'expired',
    },
    {
      id: 3,
      name: 'Weekend Special',
      code: 'WEEKEND15',
      description: '15% off on weekend orders',
      discount: '15% OFF',
      minOrder: 20,
      maxDiscount: 8,
      usage: 67,
      usageLimit: 150,
      expiry: '12/31/2024',
      status: 'inactive',
    },
  ],
};

const couponSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    activateCoupon: (state, action) => {
      const coupon = state.list.find(c => c.id === action.payload);
      if (coupon) {
        coupon.status = 'active';
      }
    },
    deactivateCoupon: (state, action) => {
      const coupon = state.list.find(c => c.id === action.payload);
      if (coupon) {
        coupon.status = 'inactive';
      }
    },
    deleteCoupon: (state, action) => {
      state.list = state.list.filter(c => c.id !== action.payload);
    },
    addCoupon: (state, action) => {
      const newCoupon = {
        ...action.payload,
        id: Date.now(), // Generate unique ID
        usage: 0,
        status: 'inactive',
      };
      state.list.push(newCoupon);
    },
    editCoupon: (state, action) => {
      const { id, data } = action.payload;
      const coupon = state.list.find(c => c.id === id);
      if (coupon) {
        Object.assign(coupon, data);
      }
    },
  },
});

export const {
  activateCoupon,
  deactivateCoupon,
  deleteCoupon,
  addCoupon,
  editCoupon,
} = couponSlice.actions;

export default couponSlice.reducer;
