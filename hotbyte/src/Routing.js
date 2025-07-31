import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import LoginPage from './Pages/LoginPage';
import Signup from './Pages/Signup';
import Terms from './Pages/Terms';
import About from './Pages/About';
import Contact from './Pages/Contact';
import MenuPage from './Pages/MenuPage';
import ForgotPassword from './Components/ForgetPassword';
import ResetPassword from './Components/ResetPassword';
import ChangePassword from './Components/ChangePassword';

// Customer Pages
import ProfileSettingsPage from './Pages/Customer/ProfileSettingsPage';
import MyOrders from './Components/Customer/MyOrders';
import CheckoutPage from './Components/Customer/CheckoutPage';
import CartComponent from './Components/Customer/CartComponent';

// Admin Pages
import AdminDashboardPage from './Pages/Admin/AdminDashboardPage';
import UserManagePage from './Pages/Admin/UserManagePage';
import RestaurantManagePage from './Pages/Admin/RestaurantManagePage';
import OrderManagePage from './Pages/Admin/OrderManagePage';
import CouponPage from './Pages/Admin/CouponPage';
import CategoryManagePage from './Pages/Admin/CategoryManagePage';
import MenuItemsPage from './Pages/Admin/MenuItemsPage';

// Restaurant Pages
import RestaurantDashboardPage from './Pages/Restaurant/RestaurantDashboardPage';
import RestaurantMenuPage from './Pages/Restaurant/RestaurantMenuPage';
import RestaurantCategoryPage from './Pages/Restaurant/RestaurantCategoryPage';
import RestaurantOrderPage from './Pages/Restaurant/RestaurantOrderPage';
import RestaurantProfileManagementPage from './Pages/Restaurant/RestaurantProfileManagementPage';

// Layouts
import AdminLayout from './Components/Admin/AdminLayout';
import RestaurantLayout from './Components/Restaurant/RestaurantLayout';


const Routing = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />

      {/* Customer Routes */}
      <Route path="/profile" element={<ProfileSettingsPage />} />
      <Route path="/orders" element={<MyOrders />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/cart" element={<CartComponent />} />

      {/* Admin Routes with Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="users" element={<UserManagePage />} />
        <Route path="restaurants" element={<RestaurantManagePage />} />
        <Route path="orders" element={<OrderManagePage />} />
        <Route path="coupons" element={<CouponPage />} />
        <Route path="categories" element={<CategoryManagePage />} />
        <Route path="menu" element={<MenuItemsPage />} />
      </Route>

      {/* Restaurant Routes with Layout */}
      <Route path="/restaurant" element={<RestaurantLayout />}>
        <Route path="dashboard" element={<RestaurantDashboardPage />} />
        <Route path="menu" element={<RestaurantMenuPage />} />
        <Route path="categories" element={<RestaurantCategoryPage />} />
        <Route path="orders" element={<RestaurantOrderPage />} />
        <Route path="profile" element={<RestaurantProfileManagementPage />} />
      </Route>
    </Routes>
  );
};

export default Routing;
