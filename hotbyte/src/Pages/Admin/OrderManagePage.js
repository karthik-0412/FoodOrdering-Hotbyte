import React from 'react';
import AdminLayout from '../../Components/Admin/AdminLayout';
import AdminDashboard from '../../Components/Admin/AdminDashboard';
import UserManagement from '../../Components/Admin/UserManagement';
import OrderManagement from '../../Components/Admin/OrderManagement';

// Or put JSX inline

export default function OrderManagePage() {
  return (
    // <AdminLayout>
      <OrderManagement/>
    // </AdminLayout>
  );
}