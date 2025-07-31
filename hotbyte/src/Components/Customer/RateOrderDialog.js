import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Rating } from 'primereact/rating';
import { Button } from 'primereact/button';

const RateOrderDialog = ({ visible, order, rating, review, onRatingChange, onReviewChange, onSubmit, onHide }) => {
  return (
    <Dialog header={`Rate & Review Order #${order?.orderId}`} visible={visible} style={{ width: '30vw' }} onHide={onHide}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <small>Min. 10 characters</small>
          <Button label="Submit" onClick={() => onSubmit(order?.orderId)} disabled={!rating || review.length < 10} />
        </div>
      }>
      {order && (
        <>
          <h4>Rate Your Experience</h4>
          <Rating value={rating} onChange={(e) => onRatingChange(e.value)} cancel={false} />
          <textarea
            rows={4}
            value={review}
            onChange={(e) => onReviewChange(e.target.value)}
            style={{ width: '100%', marginTop: '1rem' }}
            placeholder="Write your review..."
          />
        </>
      )}
    </Dialog>
  );
};

export default RateOrderDialog;
