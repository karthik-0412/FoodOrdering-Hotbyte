import React from 'react';
import RestaurantLayout from '../../Components/Restaurant/RestaurantLayout';
import RestaurantDashboard from '../../Components/Restaurant/RestaurantDashboard';
import RestaurantOrderManagement from '../../Components/Restaurant/RestaurantOrderManagement';
// import RestaurantMenuManagement from '../../Components/Restaurant/RestaurantMenuManagement';

// Or put JSX inline

export default function RestaurantOrderPage() {
  return (
    // <RestaurantLayout>
        <RestaurantOrderManagement/>
    // </RestaurantLayout>
     
  );
}
