// src/components/OrderManagement.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Paginator } from 'primereact/paginator';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Eye } from 'lucide-react';
import axios from 'axios';
import {
  setSearch,
  setStatus,
  setRestaurant,
  setPagination,
  setOrders
} from '../../state/slice/orderSlice';

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

const OrderManagement = () => {
  const dispatch = useDispatch();
  const { orders, search, status, restaurant, pagination } = useSelector(
    (state) => state.orders
  );

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:9002/api/order/orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        console.log('Orders fetched:', res.data);
        dispatch(setOrders(res.data));
      })
      .catch((err) => {
        console.error('Error fetching orders:', err);
      });
  }, [dispatch]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      search === '' ||
      order.restaurant?.restaurantName
        ?.toLowerCase()
        .includes(search.toLowerCase());
    const matchesStatus =
      status === 'All Status' || order.status?.toLowerCase() === status.toLowerCase();

    const matchesRestaurant =
      restaurant === 'All Restaurants' ||
      order.restaurant?.restaurantName === restaurant;
    return matchesSearch && matchesStatus && matchesRestaurant;
  });

  const paginatedOrders = filteredOrders.slice(
    pagination.first,
    pagination.first + pagination.rows
  );

  const revenue = filteredOrders
    .reduce((acc, order) => acc + (order.totalPrice ?? 0), 0)
    .toFixed(2);

  const uniqueRestaurants = [
    ...new Set(
      orders.map((o) => o.restaurant?.restaurantName).filter(Boolean)
    )
  ];

  return (
    <div style={{ width: '100%', margin: '2rem auto', fontFamily: 'Arial', minHeight: '100vh' }}>
      <h2 style={{ fontSize: '28px', fontWeight: '700' }}>Order Management</h2>
      <p style={{ color: '#6b7280' }}>Monitor and manage all platform orders</p>

      {/* Summary Cards */}
      
      <div style={{ display: 'flex', gap: '1rem', margin: '2rem 0' }}>
        {[
          { label: 'Total Orders', value: filteredOrders.length, color: '#3b82f6' },
          {
            label: 'Placed',
            value: filteredOrders.filter((o) => o.status?.toLowerCase() === 'placed').length,
            color: statusColors['placed']
          },
          {
            label: 'Ready to Serve',
            value: filteredOrders.filter((o) => o.status?.toLowerCase() === 'ready').length,
            color: statusColors['ready']
          },
          {
            label: 'Cancelled',
            value: filteredOrders.filter((o) => o.status?.toLowerCase() === 'cancelled').length,
            color: statusColors['cancelled']
          },
          {
            label: 'Revenue',
            value: `₹${revenue}`,
            color: '#a855f7'
          }
        ].map((card, idx) => (
          <div
            key={idx}
            style={{
              flex: 1,
              background: '#fff',
              padding: '1rem',
              borderRadius: '12px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <span style={{ color: '#6b7280', fontSize: '14px' }}>{card.label}</span>
            <span style={{ fontWeight: 'bold', fontSize: '18px', color: card.color }}>{card.value}</span>
          </div>
        ))}
      </div>


      {/* Filters */}
      <div
        style={{
          background: '#fff',
          padding: '1rem',
          borderRadius: '12px',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
        }}
      >
        <InputText
          placeholder="Search orders..."
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          style={{ flex: 1, padding: '1.2rem' }}
        />
        <Dropdown
          value={status}
          options={['All Status', ...Object.keys(statusColors)]}
          onChange={(e) => dispatch(setStatus(e.value))}
          style={{ padding: '0.3rem', borderRadius: '6px', width: '150px' }}
        />
        <Dropdown
          value={restaurant}
          options={['All Restaurants', ...uniqueRestaurants]}
          onChange={(e) => dispatch(setRestaurant(e.value))}
          style={{ padding: '0.3rem', borderRadius: '6px', width: '180px' }}
        />
      </div>

      {/* Order Table */}
      <table style={{ width: '100%', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
        <thead style={{ background: '#f3f4f6' }}>
          <tr>
            {['Order ID', 'Restaurant', 'Items', 'Total', 'Status', 'Order Date & Time', 'Actions'].map((h, i) => (
              <th key={i} style={{ textAlign: 'left', padding: '0.75rem' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedOrders.map((o) => (
            <tr key={o.orderId} style={{ borderTop: '1px solid #e5e7eb' }}>
              <td style={{ padding: '0.75rem' }}>#{o.orderId}</td>
              <td style={{ padding: '0.75rem' }}>{o.restaurant?.restaurantName}</td>
              <td style={{ padding: '0.75rem' }}>{o.items?.length} items<br/><span style={{ color: '#6b7280', fontSize: '12px' }}>{o.items?.reduce((sum, item) => sum + item.quantity, 0)} total qty</span></td>
              <td style={{ padding: '0.75rem' }}>
                <strong>₹{(o.totalPrice ?? 0).toFixed(2)}</strong><br />
                <><span style={{ color: '#6b7280', fontSize: '12px' }}>{o.payment?.method}</span></>
              </td>
              <td style={{ padding: '0.75rem' }}>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '999px',
                  fontSize: '12px',
                  backgroundColor: `${statusColors[o.status?.toLowerCase()] ?? '#ccc'}20`,
                  color: statusColors[o.status?.toLowerCase()] ?? '#555',
                  fontWeight: '500'
                }}>
                  {o.status}
                </span>

              </td>
              <td style={{ padding: '0.75rem' }}>
                {new Date(o.orderDate).toLocaleString()}
              </td>
              <td style={{ padding: '0.75rem' }}>
                <Button
                  style={{
                    background: '#e5e7eb',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.6rem 0.6rem',
                    cursor: 'pointer',
                    color: 'black',
                    fontSize: '12px'
                  }}
                  icon={<Eye size={16} style={{ color: 'black' }} />}
                  label=" View"
                  onClick={() => {
                    setSelectedOrder(o);
                    setDialogVisible(true);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <Paginator
        first={pagination.first}
        rows={pagination.rows}
        totalRecords={filteredOrders.length}
        rowsPerPageOptions={[5, 10, 20, 50, 100]}
        onPageChange={(e) =>
          dispatch(setPagination({ first: e.first, rows: e.rows }))
        }
        style={{ marginTop: '1rem', justifyContent: 'center' }}
      />

      {/* Dialog */}
      <Dialog
        header={`Order #${selectedOrder?.orderId} Details`}
        visible={dialogVisible}
        style={{ width: '50vw', borderRadius: '12px' }}
        onHide={() => setDialogVisible(false)}
      >
        {selectedOrder && (
          <div style={{ fontFamily: 'Arial' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h4>Order Information</h4>
                <p><strong>Order ID:</strong> #{selectedOrder.orderId}</p>
                <p><strong>Restaurant:</strong> {selectedOrder.restaurant?.restaurantName}</p>
                <p><strong>Status:</strong> {selectedOrder.status}</p>
                <p><strong>Order Time:</strong> {new Date(selectedOrder.orderDate).toLocaleString()}</p>
              </div>
              <div>
                <h4>Payment & Delivery</h4>
                <p><strong>Payment Method:</strong> {selectedOrder.payment?.method}</p>
                <p><strong>Payment Status:</strong> <span style={{ color: '#22c55e', fontWeight: '600' }}>completed</span></p>
                <p><strong>Total Amount:</strong> ₹{(selectedOrder.totalPrice ?? 0).toFixed(2)}</p>
                <p><strong>Est. Delivery:</strong> {selectedOrder.estimatedDelivery}</p>
              </div>
            </div>
            <div>
              <h4>Delivery Address</h4>
              <p>
                {selectedOrder.address?.street}, {selectedOrder.address?.city},{' '}
                {selectedOrder.address?.state} - {selectedOrder.address?.pincode}
              </p>
            </div>
            
            <div>
              <h4>Order Items</h4>
              {(selectedOrder.items || []).map((item, idx) => (
                <div key={idx} style={{ display: 'flex', marginBottom: '1rem', gap: '1rem' }}>
                  <img src={item.menu?.imageUrl} alt={item.menu?.itemName} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div>
                    <p><strong>{item.menu?.itemName}</strong></p>
                    <p>Qty: {item.quantity}</p>
                    <p>₹{(item.menu?.price * item.quantity).toFixed(2)} (₹{item.menu?.price} each)</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}
      </Dialog>
    </div>
  );
};

export default OrderManagement;
