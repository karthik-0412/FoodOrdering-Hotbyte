import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Users, Store, Package, Star, IndianRupee } from 'lucide-react';
import { fetchDashboardData } from '../../state/slice/admindashboardReducer';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
   const nav = useNavigate();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.admindashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const statusColors = {
    pending: '#f59e0b',
  confirmed: '#3b82f6',
  preparing: '#fbbf24',
  ready: '#10b981',
  dispatched: '#6366f1',
  delivered: '#22c55e',
  cancelled: '#ef4444',
  placed: '#6366f1'
  };
  const handleOrderClick = () => {
    nav('/admin/orders');
  };
  const handleRestaurantClick = () => {
    nav('/admin/restaurants');
  };
  return (
    <div style={{ padding: '2rem', background: '#fff7ee' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Admin Dashboard</h2>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Welcome back, Admin User! Here's your platform overview.</p>

      {/* Top Stats */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Card style={{ flex: 1, padding: '1rem', minWidth: '200px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Users size={32} color="#2563eb" />
            <div>
              <div>Total Users</div>
              <h3>{data.users}</h3>
              <small style={{ color: 'green' }}>+12% vs last period</small>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1, padding: '1rem', minWidth: '200px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Store size={32} color="#059669" />
            <div>
              <div>Active Restaurants</div>
              <h3>{data.restaurants}</h3>
              <small style={{ color: 'green' }}>+3 vs last period</small>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1, padding: '1rem', minWidth: '200px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Package size={32} color="#f97316" />
            <div>
              <div>Total Orders</div>
              <h3>{data.orders}</h3>
              <small style={{ color: 'green' }}>+18% vs last period</small>
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1, padding: '1rem', minWidth: '200px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <IndianRupee size={32} color="#8b5cf6" />
            <div>
              <div>Platform Revenue</div>
              <h3>₹{data.revenue.toLocaleString()}</h3>
              <small style={{ color: 'green' }}>+22% vs last period</small>
            </div>
          </div>
        </Card>
      </div>

      {/* Middle Section */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        {/* Recent Orders */}
        <Card style={{ flex: 1, minWidth: '300px', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ margin: 0 }}>Recent Orders</h4>
            <button style={{ border: 'none', background: 'transparent', color: 'orange', cursor: 'pointer' }} onClick={handleOrderClick}>View All</button>
          </div>
          {data.recentOrders.map((order) => (
            <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', background: '#f3f4f6', padding: '0.5rem 1rem', borderRadius: '8px' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>{order.name}</div>
                <small>{order.restaurant}</small>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}> 
                <strong>₹{order.amount.toFixed(2)}</strong>
                <div style={{ background: statusColors[order.status], padding: '2px 8px', borderRadius: '6px', fontSize: '12px', marginTop: '4px', textAlign: 'center', color:'white' }}>{order.status}</div>
              </div>
            </div>
          ))}
        </Card>

        {/* Restaurant Status */}
        <Card style={{ flex: 1, minWidth: '300px', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ margin: 0 }}>Restaurant Status</h4>
            <button style={{ border: 'none', background: 'transparent', color: 'orange', cursor: 'pointer' }} onClick={handleRestaurantClick}>Manage All</button>
          </div>
          {data.restaurantStatus.map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>{r.name}</div>
                <small>{r.address}</small>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star size={14} color="#f59e0b" fill="#f59e0b" />
                <span style={{ fontWeight: 'bold' }}>{r.rating}</span>
                <Tag value="Active" severity="success" />
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Bottom Section - Platform Analytics */}
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '250px', background: '#6366f1', color: 'white', borderRadius: '10px', padding: '1rem' }}>
          <h4>Total Menu Items</h4>
          <h2>{data.menuItems}</h2>
          <small>Across all restaurants</small>
        </div>
        <div style={{ flex: 1, minWidth: '250px', background: '#10b981', color: 'white', borderRadius: '10px', padding: '1rem' }}>
          <h4>Average Order Value</h4>
          <h2>₹{data.avgOrderValue?.toFixed(2)}</h2>
          <small>Per order</small>
        </div>
        <div style={{ flex: 1, minWidth: '250px', background: '#ef4444', color: 'white', borderRadius: '10px', padding: '1rem' }}>
          <h4>Platform Commission</h4>
          <h2>₹{data.commission?.toFixed(2)}</h2>
          <small>This month</small>
        </div>
      </div>
    </div>
  );
}
