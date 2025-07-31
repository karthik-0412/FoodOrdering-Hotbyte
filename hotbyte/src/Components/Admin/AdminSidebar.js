import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Users, Building2, ShoppingCart, LineChart, Folder,
  TicketPercent, Settings, LogOut
} from 'lucide-react';
import { Divider } from 'primereact/divider';

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: <Home size={18} />, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: <Users size={18} />, label: 'User Management', path: '/admin/users' },
    { icon: <Building2 size={18} />, label: 'Restaurants', path: '/admin/restaurants' },
    { icon: <ShoppingCart size={18} />, label: 'Orders', path: '/admin/orders' },
    { icon: <LineChart size={18} />, label: 'Menu Items', path: '/admin/menu' },
    { icon: <Folder size={18} />, label: 'Categories', path: '/admin/categories' },
    { icon: <TicketPercent size={18} />, label: 'Coupons', path: '/admin/coupons' },
  ];


  const handleSettingsClick = () => {
    navigate('/change-password');
  };

  

  return (
    <div style={{
      width: '250px',
      height: '100vh',
      background: '#fff',
      borderRight: '1px solid #ddd',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000
    }}>
      {/* Top Section */}
      <div>
        {/* Logo & Admin Panel */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #eee',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}>
          <img
            src="/hotbytelogo.png"
            alt="HotByte Logo"
            style={{ width: '150px', height: '42px', marginBottom: '8px' }}
          />
          <div style={{ fontSize: '12px', color: '#888' }}>Admin Panel</div>
        </div>

        {/* User Info */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #eee',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{
            background: 'linear-gradient(to right, #7c3aed, #3b82f6)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            marginRight: '10px'
          }}>A</div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Admin User</div>
            <div style={{ fontSize: '12px', color: '#666' }}>admin@hotbyte.com</div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ padding: '10px 0' }}>
          {navItems.map((item, i) => {
            const isActive = location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={i}
                to={item.path}
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 20px',
                  background: isActive ? 'linear-gradient(to right, #f97316, #ef4444)' : 'transparent',
                  color: isActive ? '#fff' : '#333',
                  borderRadius: isActive ? '8px' : '0',
                  margin: '4px 12px',
                  fontWeight: isActive ? 'bold' : 'normal',
                  cursor: 'pointer'
                }}
              >
                <div style={{ marginRight: '10px' }}>{item.icon}</div>
                <div>{item.label}</div>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Bottom Section */}
      <div>
        <Divider />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '38px',
          cursor: 'pointer',
          color: '#555'
        }}
          onClick={handleSettingsClick}
        >
          <Settings size={18} style={{ marginRight: '10px' }} />
          Settings
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 20px',
          cursor: 'pointer',
          color: '#ef4444'
        }}>
          {/* <LogOut size={18} style={{ marginRight: '10px' }} />
          Logout */}
          <div
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 20px',
              cursor: 'pointer',
              color: '#ef4444'
            }}
          >
            <LogOut size={18} style={{ marginRight: '10px' }} />
            Logout
          </div>
        </div>
      </div>
    </div>
  );
}
