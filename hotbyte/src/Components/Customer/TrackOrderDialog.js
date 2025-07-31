import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';

const statusColors = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  preparing: '#fbbf24',
  dispatched: '#6366f1',
  delivered: '#22c55e',
  cancelled: '#ef4444'
};

const TrackOrderDialog = ({ visible, order, onHide }) => {
  const steps = ['Order Placed', 'Confirmed', 'Preparing', 'Dispatched', 'Delivered'];

  const statusIndex = steps.findIndex(step => step.toLowerCase() === order?.status?.toLowerCase());

  return (
    <Dialog header={`Track Order #${order?.orderId}`} visible={visible} style={{ width: '40vw' }} onHide={onHide}>
      {order && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h3>{order.restaurant?.restaurantName}</h3>
              <p>{new Date(order.orderDate).toLocaleDateString()}</p>
            </div>
            <div>
              <Tag value={order.status} style={{ backgroundColor: statusColors[order.status.toLowerCase()] }} />
              <div>₹{order.totalPrice}</div>
            </div>
          </div>
          <hr />
          {steps.map((step, index) => (
            <div key={index} style={{ opacity: index <= statusIndex ? 1 : 0.6 }}>
              <i className={`pi pi-${index <= statusIndex ? 'check-circle' : 'clock'}`} style={{ marginRight: '0.5rem' }}></i>
              {step}
            </div>
          ))}
          <hr />
          <p><strong>Address:</strong> {`${order.address?.street}, ${order.address?.city}, ${order.address?.state}`}</p>
          <p><strong>ETA:</strong> 45 mins</p>
          <p><strong>Contact:</strong> +91-99999-99999</p>
        </>
      )}
    </Dialog>
  );
};

export default TrackOrderDialog;
