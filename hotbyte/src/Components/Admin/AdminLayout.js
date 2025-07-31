import React from 'react';
import AdminSidebar from './AdminSidebar';
import Footer from '../Footer';
import CustomMenubar from '../CustomMenubar';
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Fixed Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div
        style={{
          marginLeft: '250px', // Matches AdminSidebar width
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

        {/* Scrollable Page Content + Footer */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
          <div style={{ flex: 1, padding: '40px' }}>
            <Outlet />
          </div>

          {/* Footer always comes last */}
          <Footer />
        </div>
      </div>
    </div>
  );
}
