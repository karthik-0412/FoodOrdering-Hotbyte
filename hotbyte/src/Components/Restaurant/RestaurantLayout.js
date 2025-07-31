// src/layouts/RestaurantLayout.js
import React from 'react';

import Footer from '../Footer';
import CustomMenubar from '../CustomMenubar';
import RestaurantSidebar from './RestaurantSidebar';
import { Outlet } from 'react-router-dom';

export default function RestaurantLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Fixed Sidebar */}
      <RestaurantSidebar />

      {/* Main Content Area */}
      <div
        style={{
          marginLeft: '260px', // Matches RestaurantSidebar width
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          minHeight: '100vh',
          background: '#fff7ee'
        }}
      >
        {/* Top Menubar */}
        <div style={{
          background: '#fff',
          borderBottom: '1px solid #ddd',
          zIndex: 1,
        }}>
          <CustomMenubar />
        </div>

        {/* Page Content + Footer */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
          <div style={{ flex: 1, padding: '40px' }}>
            <Outlet />
          </div>

          {/* Sticky Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
}
