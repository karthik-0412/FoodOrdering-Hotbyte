import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import './OrderManagement.css';

const statusOptions = [
  { label: 'All Orders', value: 'all' },
  { label: 'Placed', value: 'placed' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Preparing', value: 'preparing' },
  { label: 'Ready', value: 'ready' },
  { label: 'Dispatched', value: 'dispatched' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
];

const nextStatus = {
  placed: 'confirmed',
  confirmed: 'preparing',
  preparing: 'ready',
  ready: 'dispatched',
  dispatched: 'delivered',
  delivered: 'delivered',
  cancelled: 'cancelled',
};

const RestaurantOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');

  const token = localStorage.getItem("token");
  const restaurantId = localStorage.getItem("restaurantId");

  const fetchOrders = async () => {
    if (!restaurantId || !token) return;

    try {
      const response = await axios.get(`http://localhost:9002/api/order/restaurant/${restaurantId}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const normalized = (response.data || []).map(order => ({
        ...order,
        status: order.status?.toLowerCase() || 'placed',
        payment: {
          method: order.payment?.method || 'N/A',
          status: order.payment?.status?.toLowerCase() || 'unknown',
        },
        address: {
          street: order.address?.street || '',
          city: order.address?.city || '',
          state: order.address?.state || '',
          pincode: order.address?.pincode || '',
        },
        menuSummary: Array.isArray(order.menuSummary) ? order.menuSummary : [],
        totalPrice: order.totalPrice ?? 0,
        estimatedDelivery: order.estimatedDelivery || '30-45 mins',
        orderDate: order.orderDate || new Date().toISOString(),
      }))
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

      setOrders(normalized);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  const updateOrderStatus = async (orderId, currentStatus) => {
    const next = nextStatus[currentStatus];
    if (!next || !token) return;

    try {
      await axios.put(
        `http://localhost:9002/api/order/orders/${orderId}/status`,
        { status: next.toUpperCase() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders(); // reload after update
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getSeverity = (status) => {
    switch (status) {
      case 'placed': return 'warning';
      case 'confirmed':
      case 'preparing': return 'info';
      case 'ready': return 'success';
      case 'dispatched': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return null;
    }
  };

  const filteredOrders = orders.filter(order =>
    filter === 'all' ? true : order.status === filter
  );

  return (
    <div className="order-management-container">
      <h2>Order Management</h2>
      <p className="subtitle">Manage and track your restaurant orders</p>

      <div className="order-status-cards">
        {statusOptions.map((status) => (
          <div
            key={status.value}
            className={`status-card ${filter === status.value ? 'active' : ''}`}
            onClick={() => setFilter(status.value)}
          >
            <h4>{status.label}</h4>
            <p>
              {status.value === 'all'
                ? orders.length
                : orders.filter((o) => o.status === status.value).length}
            </p>
          </div>
        ))}
      </div>

      <div className="filter-container">
        <label htmlFor="statusFilter">Filter by Status</label>
        <Dropdown
          id="statusFilter"
          value={filter}
          options={statusOptions}
          onChange={(e) => setFilter(e.value)}
          placeholder="Select a status"
          className="status-dropdown"
        />
      </div>

      {filteredOrders.map((order) => (
        <div className="order-card-full" key={order.orderId}>
          <div className="order-header">
            <div>
              <strong>Order #{order.orderId}</strong>
              <div className="order-date">{new Date(order.orderDate).toLocaleString()}</div>
            </div>
            <div className="order-header-right">
              <Tag value={order.status.toUpperCase()} severity={getSeverity(order.status)} />
              <h4 className="order-total">₹{order.totalPrice?.toFixed(2)}</h4>
            </div>
          </div>

          <div className="order-body">
            <div className="order-items">
              <h5>Order Items</h5>
              {(order.items || []).map((item, idx) => {
  const imageName = item.menu?.itemName?.toLowerCase().replace(/\s+/g, '-');
  const imageUrl = item.menu?.imageUrl;

  return (
    <div key={idx} className="order-item-with-image">
      <img src={imageUrl} alt={item.menu?.itemName} className="order-item-image" />
      <div className="order-item-info">
        <p>{item.menu?.itemName}</p>
        <span>Qty: {item.quantity}</span>
      </div>
      <span className="item-price">
        ₹{item.price ? item.price.toFixed(2) : '0.00'}
      </span>
    </div>
  );
})}

            </div>

            <div className="order-details">
              <h5>Order Details</h5>
              <p><strong>Payment Method:</strong> {order.payment.method}</p>
              <p><strong>Payment Status:</strong>
                <Tag value={order.payment.status} severity="success" className="ml-2" />
              </p>
              <p><strong>Delivery Address:</strong>
                {`${order.address.street}, ${order.address.city}, ${order.address.state} - ${order.address.pincode}`}
              </p>
              <p><strong>Est. Delivery:</strong> {order.estimatedDelivery}</p>
            </div>
          </div>

          <div className="order-footer">
            <div />
            {order.status !== 'delivered' && order.status !== 'cancelled' && (
              <Button
                label={`Mark as ${nextStatus[order.status]}`}
                onClick={() => updateOrderStatus(order.orderId, order.status)}
                severity="success"
                size="small"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RestaurantOrderManagement;
