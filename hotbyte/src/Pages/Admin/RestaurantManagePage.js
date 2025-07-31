import React from 'react';
import AdminLayout from '../../Components/Admin/AdminLayout';
import CategoryManagement from '../../Components/Admin/CategoryManagement';
import RestaurantManagement from '../../Components/Admin/RestaurantMangement';

// Or put JSX inline

export default function RestaurantManagePage() {
  return (
    // <AdminLayout>
      <RestaurantManagement/>
    // </AdminLayout>
  );
}
