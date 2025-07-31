import React, { useState, useEffect } from 'react';
import './RestaurantDashboard.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { IndianRupee } from 'lucide-react';

const RestaurantDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:9002/api/restaurant/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDashboardData(response.data);
        console.log('Dashboard Data:', response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      }
    };

    fetchDashboardData();
  }, []);

  if (!dashboardData) {
    return <p>Loading...</p>;
  }

  const {
    totalOrders,
    menuItemCount,
    todaysRevenue,

    averagePrepTime
    ,
    recentOrders,
    popularItems,
  } = dashboardData;

  return (
    <div className="restaurant-dashboard-container">
      <h2>Restaurant Dashboard</h2>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <i className="pi pi-shopping-bag stat-icon blue" />
          <h4>Total Orders</h4>
          <p className="stat-value">{totalOrders}</p>
        </div>
        <div className="stat-card">
          <i className="pi pi-list stat-icon green" />
          <h4>Menu Items</h4>
          <p className="stat-value">{menuItemCount}</p>
        </div>
        <div className="stat-card">
          <IndianRupee size={24} color="orange" className="stat-icon" />
          <h4>Today's Revenue</h4>
          <p className="stat-value">₹{todaysRevenue.toFixed(2)}</p>
        </div>

        <div className="stat-card">
          <i className="pi pi-clock stat-icon purple" />
          <h4>Avg Prep Time</h4>
          <p className="stat-value">{averagePrepTime} min</p>
        </div>
      </div>

      {/* Middle Widgets */}
      <div className="middle-widgets">
        {/* Recent Orders */}
        <div className="recent-orders">
          <div className="widget-header">
            <h3>Recent Orders</h3>
            <Link to="/restaurant/orders">View All</Link>
          </div>
          {console.log('Recent Orders:', recentOrders)}

          {recentOrders.length === 0 ? (
            <p>No recent orders</p>
          ) : (
            recentOrders.map((order) => (
              <div className="order-card" key={order.id}>
                <div>
                  <strong>Order #{order.id}</strong>
                  <p>{order.items?.length} items</p>
                  {/* <p>{order.items.length || order.menuSummary} items</p> */}

                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
  <strong>₹{order.total.toFixed(2)}</strong>
  <span className={`badge ${order.status.toLowerCase()}`}>{order.status}</span>
</div>

              </div>
            ))
          )}
        </div>

        {/* Popular Items */}
        <div className="popular-items">
          <div className="widget-header">
            <h3>Popular Items</h3>
            <Link to="/restaurant/menu">Manage Menu</Link>
          </div>
          {console.log('Popular Items:', popularItems)}
          {popularItems.length === 0 ? (
            <p>No popular items</p>
          ) : (
            popularItems.map((item) => (
              <div className="menu-item" key={item.menuId}>
                <img src={item.imageUrl || '/default-food.jpg'} alt={item.name} />
                <div className="item-info">
                  <strong>{item.name}</strong>
                  <p>{item.category}</p>
                </div>
                <div className="item-right">
                  <strong>₹{item.price}</strong>
                  <p>{item.avgPrepTime} min</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
