// import React, { useState } from 'react';
// import { Outlet } from "react-router-dom";
// import './Restaurant.css';
// import RestaurantSidebar from './RestaurantSidebar';
// import HeaderMenu from '../common/HeaderMenu';

// const Restaurant = () => {
//   const [sidebarVisible, setSidebarVisible] = useState(true);
//   const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

//   return (
//     <div>
//       <HeaderMenu userRole="restaurant" onToggleSidebar={toggleSidebar} />
      
//       <div className="restaurant-layout">
//         {sidebarVisible && <RestaurantSidebar />}
//         <div className="restaurant-content">
//           <Outlet /> 
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Restaurant;