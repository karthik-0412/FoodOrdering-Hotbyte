import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import CustomMenubar from '../CustomMenubar';
import axios from 'axios';
import { useEffect } from 'react';
import Footer from '../Footer';


const statusColors = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  preparing: '#fbbf24',
  ready: '#10b981',
  dispatched: '#6366f1',
  delivered: '#22c55e',
  cancelled: '#ef4444'
};


const MyOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [ratingOrder, setRatingOrder] = useState(null);
  const [ratingValue, setRatingValue] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:9002/api/order/myorders", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log("Fetched Orders: ", response.data);

        // If response.data is an object, update this line:
        const ordersData = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data.orders)
            ? response.data.orders
            : [];

             const sortedOrders = ordersData.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

        setOrders(sortedOrders);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };

    fetchOrders();
  }, []);


  const formatDate = (date) => {
    const d = new Date(date.getTime() + 40 * 60000); // Add 40 minutes
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };


  // ]);

  const getStatusProgress = (status) => {
    const normalized = status?.toLowerCase();
    if (normalized === 'cancelled') return 100;
    const statusOrder = ['pending', 'confirmed', 'preparing', 'ready', 'dispatched', 'delivered'];
    const currentIndex = statusOrder.indexOf(normalized);
    return currentIndex >= 0 ? ((currentIndex + 1) / statusOrder.length) * 100 : 0;
  };



  const handleTrackOrder = (order) => {
    setSelectedOrder(order);
    setIsTrackingModalOpen(true);
  };

  const handleReorder = (order) => {
    alert(`Reordering ${order.items.length} items from ${order.restaurant?.restaurantName}`);
  };

  const handleRateOrder = (order) => {
    setRatingOrder(order);
    setIsRatingModalOpen(true);
  };

  
  const handleCancelOrder = async (orderId) => {
    try {
      // Optimistically update UI first
      setOrders(prev =>
        prev.map(order =>
          order.orderId === orderId
            ? { ...order, status: 'Cancelled' }
            : order
        )
      );

      const token = localStorage.getItem("token");

      // Call backend to persist cancellation
      await axios.put(
        `http://localhost:9002/api/order/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(`Order #${orderId} has been cancelled.`);
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel the order. Please refresh and try again.");
    }
  };
const handleSubmitReview = async (orderId, rating, review) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `http://localhost:9002/api/order/orders/${orderId}/rate`,
      { orderId, rating, review },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Update local state
    setOrders(prev =>
      prev.map(order =>
        order.orderId === orderId
          ? { ...order, rating, review }
          : order
      )
    );

    alert('Thank you for your review!');
  } catch (error) {
    console.error("Error submitting review:", error);
    alert("Failed to submit review. Please try again.");
  }
};



  // const handleSubmitReview = (orderId, rating, review) => {
  //   setOrders(prev =>
  //     prev.map(order =>
  //       order.orderId === orderId
  //         ? { ...order, rating, review }
  //         : order
  //     )
  //   );
  //   alert('Thank you for your review!');
  // };

  return (<>
    <CustomMenubar />
    <div style={{ minHeight: '100vh', background: '#f9f9f9', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>My Orders</h1>

      {Array.isArray(orders) && orders.map(order => (
        <div key={order.orderId} style={{
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div>
              <h3 style={{ margin: 0 }}>Order #{order.orderId}</h3>
              <p>{order.restaurant?.restaurantName} • {new Date(order.orderDate).toLocaleString()}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Tag
                value={order.status}
                style={{
                  backgroundColor: statusColors[order.status.toLowerCase()],
                  color: 'white',
                  borderRadius: '4px',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  textTransform: 'capitalize'
                }}
              />

              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f97316' }}>
                ₹{order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}
              </div>

            </div>
          </div>

          <ProgressBar
            value={getStatusProgress(order.status)}
            showValue={false}
            style={{ height: '8px', backgroundColor: '#f3f3f3' }}
            pt={{
              value: {
                style: {
                  backgroundColor: order.status?.toLowerCase() === 'cancelled' ? '#ef4444' : '#f97316'
                }
              }
            }}
          />



          {order.rating && order.review && (
            <div style={{
              background: '#fff7e6',
              border: '1px solid #ffe58f',
              borderRadius: '6px',
              padding: '1rem',
              marginTop: '1rem'
            }}>
              <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                <Rating
                  value={order.rating}
                  readOnly
                  cancel={false}
                  style={{ fontSize: '2.8rem' }}
                  pt={{
                    onIcon: {
                      className: 'pi pi-star-fill',
                      style: { color: '#facc15', fontSize: '2.8rem', margin: '0 0.2rem' }
                    },
                    offIcon: {
                      className: 'pi pi-star',
                      style: { color: '#e5e7eb', fontSize: '2.8rem', margin: '0 0.2rem' }
                    }
                  }}
                />
                <span style={{ marginLeft: '0.75rem', color: '#d48806', fontSize: '1.2rem' }}>
                  {order.rating}/5
                </span>
              </div>
              <p style={{ margin: 0, fontStyle: 'italic', color: '#555' }}>{order.review}</p>
            </div>
          )}


          <div style={{ marginTop: '1rem' }}>
            {order.items?.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={item.menu?.imageUrl} alt={item.menu?.itemName} style={{ width: '40px', height: '40px', borderRadius: '4px', marginRight: '0.5rem' }} />
                  <div>
                    <div><div>{item.menu?.itemName}</div></div>
                    <small style={{ color: '#666' }}>Qty: {item.quantity}</small>
                  </div>
                </div>
                <div>₹{item.menu?.price ? item.menu.price.toFixed(2) : '0.00'}</div>
              </div>
            ))}
          </div>
          <Divider />
          {/* Delivery Info + Buttons */}
          <div style={{
            marginTop: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>

            {/* Left: Delivery Info */}
            <div style={{ flex: 1, minWidth: '220px', marginBottom: '1rem' }}>
              <p style={{ margin: 0 }}>
                <i className="pi pi-map-marker" style={{ marginRight: '0.5rem' }}></i>
                <strong>Address:</strong> {order.address?.street}, {order.address?.city}, {order.address?.state} - {order.address?.pincode}

              </p>
              <p style={{ margin: 0 }}>
                <i className="pi pi-credit-card" style={{ marginRight: '0.5rem' }}></i>
                <strong>Payment:</strong> {order.payment?.method}
              </p>
              <p style={{ margin: 0 }}>
                <i className="pi pi-clock" style={{ marginRight: '0.5rem' }}></i>
                <strong>ETA:</strong> {new Date(new Date(order.orderDate).getTime() + 40 * 60000).toLocaleTimeString()}

              </p>
            </div>

            {/* Right: Action Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <Button label="Track Order" icon="pi pi-eye" className="p-button-outlined" style={{ color: 'black' }} onClick={() => handleTrackOrder(order)} />
              <Button label="Reorder" icon="pi pi-refresh" className="p-button-outlined" style={{ color: 'black' }} onClick={() => handleReorder(order)} />

              {order.status?.toLowerCase() === 'delivered' && !order.rating && (
                <Button label="Write Review" icon="pi pi-star" className="p-button-warning" onClick={() => handleRateOrder(order)} />
              )}

              {!['delivered', 'dispatched', 'cancelled'].includes(order.status?.toLowerCase()) && (
                <Button
                  label="Cancel Order"
                  icon="pi pi-times"
                  className="p-button-danger"
                  onClick={() => handleCancelOrder(order.orderId)}
                />
              )}
            </div>
          </div>



        </div>
      ))}

      {/* Order Tracking Modal */}
      <Dialog
        header={`Track Order #${selectedOrder?.orderId}`}
        visible={isTrackingModalOpen}
        style={{ width: '40vw' }}
        onHide={() => setIsTrackingModalOpen(false)}
      >
        {selectedOrder && (
          <div>

            {/* Top Section: Restaurant and Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0 }}>{selectedOrder.restaurant?.restaurantName}</h3>
                <p style={{ margin: 0, color: '#666' }}>Order placed on {new Date(selectedOrder.orderDate).toLocaleString()}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                  ₹{selectedOrder.totalPrice ? selectedOrder.totalPrice.toFixed(2) : '0.00'}
                </div>

                <Tag value={selectedOrder.status} style={{ backgroundColor: statusColors[selectedOrder.status.toLowerCase()], color: '#fff', borderRadius: '10px', padding: '3px 10px' }} />
              </div>
            </div>

            {/* Order Status Tracker */}
            <div style={{ marginBottom: '1rem' }}>
              <h4>Order Status</h4>
              {[
                'Placed', 'Pending', 'Confirmed', 'Preparing', 'Ready', 'Dispatched', 'Delivered'
              ].map((label, index) => {
                const normalizedStatuses = [
                  'placed', 'pending', 'confirmed', 'preparing', 'ready', 'dispatched', 'delivered'
                ];
                const currentStatus = selectedOrder.status?.toLowerCase();

                const isCompleted = normalizedStatuses.indexOf(currentStatus) >= index;
                const isCurrent = normalizedStatuses.indexOf(currentStatus) === index;

                return (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                    opacity: isCompleted ? 1 : 0.6
                  }}>
                    <i className={`pi pi-${isCompleted ? 'check-circle' : 'clock'}`} style={{
                      color: isCompleted ? 'green' : 'grey',
                      marginRight: '0.5rem'
                    }}></i>
                    <div style={{ flex: 1 }}>
                      <div>{label}</div>
                      <small style={{ color: isCurrent ? 'orange' : '#999' }}>
                        {isCurrent ? 'Current status' : (isCompleted ? 'Completed' : '')}
                      </small>
                    </div>
                    {isCompleted && <i className="pi pi-check" style={{ color: 'green' }}></i>}
                  </div>
                );
              })}

            </div>

            {/* Delivery Information */}
            <div style={{ marginBottom: '1rem' }}>
              <h4>Delivery Information</h4>
              <p>
                <i className="pi pi-map-marker" style={{ marginRight: '0.5rem' }}></i>
                Delivery Address: {selectedOrder.address?.street}, {selectedOrder.address?.city}, {selectedOrder.address?.state} - {selectedOrder.address?.pincode}

              </p>
              <p>
                <i className="pi pi-clock" style={{ marginRight: '0.5rem' }}></i>
                Estimated Delivery Time: {formatDate(new Date(selectedOrder.orderDate))}
              </p>
              <p>
                <i className="pi pi-phone" style={{ marginRight: '0.5rem' }}></i>
                Contact Support: +1 (555) 123-4567
              </p>
            </div>

            {/* Order Items */}
            <div>
              <h4>Order Items</h4>
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={item.menu?.imageUrl} alt={item.menu?.itemName} style={{ width: '40px', height: '40px', borderRadius: '4px', marginRight: '0.5rem' }} />
                    <div>
                      <div>{item.menu?.itemName}</div>
                      <small style={{ color: '#666' }}>Quantity: {item.quantity}</small>
                    </div>
                  </div>
                  <div>₹{item.menu?.price?.toFixed(2) || "0.00"}</div>

                </div>
              ))}
            </div>

            {/* Footer Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <Button label="Reorder Items" icon="pi pi-refresh" className="p-button-outlined" onClick={() => handleReorder(selectedOrder)} />
              <Button label="Contact Restaurant" icon="pi pi-phone" className="p-button-secondary" />
            </div>

          </div>
        )}
      </Dialog>


      {/* Rating Modal */}
      <Dialog
        header={`Rate & Review Order #${ratingOrder?.orderId}`}
        visible={isRatingModalOpen}
        style={{ width: '30vw' }}
        onHide={() => setIsRatingModalOpen(false)}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <small style={{ color: '#888' }}>Please follow the review guidelines</small>
            <Button
              label="Submit Review"
              icon="pi pi-check"
              onClick={() => {
                handleSubmitReview(ratingOrder.orderId, ratingValue, reviewText);
                setIsRatingModalOpen(false);
                setRatingValue(null);
                setReviewText('');
              }}
              disabled={!ratingValue || reviewText.length < 10}
            />
          </div>
        }
      >
        {ratingOrder && (
          <div>
            {/* Order Items */}
            {ratingOrder.items?.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <img src={item.menu?.imageUrl} alt={item.menu?.itemName}
                  style={{ width: '50px', height: '50px', borderRadius: '4px', marginRight: '1rem' }}
                />
                <div>
                  <div><strong>{item.menu?.itemName}</strong></div>
                  <small>Qty: {item.quantity}</small>
                </div>
              </div>
            ))}

            {/* Rating */}
            <div style={{ marginBottom: '2rem' }}>
              <h4>How was your experience?</h4>
              <Rating
                value={ratingValue}
                onChange={(e) => setRatingValue(e.value)}
                stars={5}
                cancel={false}
                style={{ fontSize: "300px" }}
              />
              <br />
              <p>Click to rate your experience</p>
            </div>

            {/* Review Textarea */}
            <div style={{ marginBottom: '1rem' }}>
              <label><strong>Write Your Review <span style={{ color: "red" }}>*</span></strong></label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Tell us about the food quality, delivery time, packaging, and overall experience..."
                rows={4}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', borderColor: '#ccc' }}
              />
              <div style={{ textAlign: 'right', color: reviewText.length < 10 ? 'red' : '#666' }}>
                {reviewText.length}/500 characters (minimum 10)
              </div>
            </div>

            {/* Review Guidelines */}
            <div style={{
              backgroundColor: '#f5f5f5',
              padding: '0.75rem',
              borderRadius: '4px',
              fontSize: '0.85rem',
              color: '#333',
            }}>
              <strong>Review Guidelines:</strong>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
                <li>Be honest and specific about your experience</li>
                <li>Mention food quality, delivery time, and packaging</li>
                <li>Keep it respectful and constructive</li>
                <li>Help other customers make informed decisions</li>
              </ul>
            </div>
          </div>
        )}
      </Dialog>


    </div>
    <Footer/>
  </>);
};

export default MyOrders;
