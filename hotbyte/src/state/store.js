import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slice/cartSlice';
import userReducer from './slice/userSlice';
import restaurantReducer from './slice/restaurantSlice'; 
import ordersReducer from './slice/orderSlice';
import couponReducer from './slice/couponSlice';
import categoryReducer from './slice/categorySlice';
import admindashboardReducer from './slice/admindashboardReducer';
import menuReducer from './slice/menuSlice';
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    restaurant: restaurantReducer, 
    orders: ordersReducer,
    coupons: couponReducer,
    category: categoryReducer,
    admindashboard: admindashboardReducer,
    menu: menuReducer,

  },
});
