import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';

const TrackOrderDialog = ({ visible, onHide, order }) => {
    const statuses = [
        { name: 'Order Placed', status: 'Completed' },
        { name: 'Confirmed', status: 'Completed' },
        { name: 'Preparing', status: 'Current status' },
        { name: 'Dispatched', status: '' },
        { name: 'Delivered', status: '' },
    ];

    return (
        <Dialog header={`Track Order #${order.id}`} visible={visible} style={{ width: '40vw' }} onHide={onHide} modal>
            <div className="flex justify-content-between align-items-center mb-3">
                <div>
                    <div className="font-bold">{order.restaurant}</div>
                    <div className="text-sm text-gray-500">Order placed on {order.date}</div>
                </div>
                <div className="text-right">
                    <div className="font-bold text-lg">${order.total.toFixed(2)}</div>
                    <Tag value={order.status} severity="warning" />
                </div>
            </div>

            <Divider />

            <h4>Order Status</h4>
            <div className="flex flex-column gap-3">
                {statuses.map((s, index) => (
                    <div key={index} className="flex align-items-center justify-content-between">
                        <div className="flex align-items-center gap-2">
                            <i className={`pi pi-${s.status === 'Completed' ? 'check-circle' : 'circle-on'}`} style={{ fontSize: '1.5rem', color: s.status === 'Completed' ? 'green' : s.status === 'Current status' ? 'orange' : 'gray' }}></i>
                            <div>
                                <div className="font-bold">{s.name}</div>
                                <div className={`text-sm ${s.status === 'Completed' ? 'text-green-500' : s.status === 'Current status' ? 'text-orange-500' : 'text-gray-400'}`}>
                                    {s.status || ''}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Divider />

            <h4>Delivery Information</h4>
            <div className="text-sm">
                <div className="mb-2"><i className="pi pi-map-marker mr-2"></i><b>Address:</b> {order.address}</div>
                <div className="mb-2"><i className="pi pi-clock mr-2"></i><b>Estimated Delivery:</b> {order.estimatedDelivery}</div>
                <div><i className="pi pi-phone mr-2"></i><b>Contact Support:</b> +1 (555) 123-4567</div>
            </div>

            <Divider />

            <h4>Order Items</h4>
            <div className="flex flex-column gap-2">
                {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-content-between">
                        <div>{item.name} (x{item.qty})</div>
                        <div>${item.price.toFixed(2)}</div>
                    </div>
                ))}
            </div>

            <div className="mt-4 text-right">
                <Button label="Close" icon="pi pi-times" onClick={onHide} />
            </div>
        </Dialog>
    );
};

export default TrackOrderDialog;
