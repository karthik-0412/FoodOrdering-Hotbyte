import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { InputTextarea } from 'primereact/inputtextarea';

const RestaurantDialog = ({ visible, mode, onHide, restaurant, onSubmit }) => {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';

  const [data, setData] = useState({
    restaurantName: '',
    location: '',
    description: '',
    status: 'ACTIVE',
    rating: 0,
    addressdto: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    userdto: {
      username: '',
      email: '',
      password: '',
      name: '',
      phoneNumber: '',
      role: 'RESTAURANT',
      status: 'ACTIVE'
    }
  });

  useEffect(() => {
    if (restaurant && (isEdit || isView)) {
      const addr = restaurant.addressdto || {};
      const user = restaurant.userdto || {};
      setData({
        restaurantName: restaurant.restaurantName || '',
        location: restaurant.location || '',
        description: restaurant.description || '',
        status: restaurant.status || 'ACTIVE',
        rating: restaurant.rating || 0,
        addressdto: {
          street: addr.street || '',
          city: addr.city || '',
          state: addr.state || '',
          pincode: addr.pincode || ''
        },
        userdto: {
          username: user.username || '',
          email: user.email || '',
          password: '',
          name: user.name || '',
          phoneNumber: user.phoneNumber || '',
          role: user.role || 'RESTAURANT',
          status: user.status || 'ACTIVE'
        }
      });
    } else {
      setData({
        restaurantName: '',
        location: '',
        description: '',
        status: 'ACTIVE',
        rating: 0,
        addressdto: {
          street: '',
          city: '',
          state: '',
          pincode: ''
        },
        userdto: {
          username: '',
          email: '',
          password: '',
          name: '',
          phoneNumber: '',
          role: 'RESTAURANT',
          status: 'ACTIVE'
        }
      });
    }
  }, [restaurant, mode]);

  const handleChange = (e, field) => {
    const value = e.target?.value;
    setData(prev => ({ ...prev, [field]: value }));
  };


  const handleAddressChange = (e, field) => {
    const value = e.target.value;
    setData(prev => ({
      ...prev,
      addressdto: {
        ...prev.addressdto,
        [field]: value
      }
    }));
  };

  const handleUserChange = (e, field) => {
    const value = e.target.value;
    setData(prev => ({
      ...prev,
      userdto: {
        ...prev.userdto,
        [field]: value
      }
    }));
  };

  const handleSubmit = () => {
  const requiredFields = [
    data.restaurantName,
    data.location,
    data.description,
    data.userdto.username,
    data.userdto.email,
    data.userdto.password,
    data.userdto.phoneNumber,
    data.addressdto.street,
    data.addressdto.city,
    data.addressdto.state,
    data.addressdto.pincode
  ];

  const isAnyEmpty = requiredFields.some(val => !val || val.trim() === '');

  if (isAnyEmpty) {
    alert("Please fill all required fields.");
    return;
  }

  console.log("Submitting restaurant:", JSON.stringify(data, null, 2));

  onSubmit(data);
  onHide();
};

  return (
    <Dialog
      header={`${isView ? 'View' : isEdit ? 'Edit' : 'Add'} Restaurant`}
      visible={visible}
      onHide={onHide}
      style={{ width: '50vw' }}
      modal
    >
      <div className="p-fluid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Name and Email */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <InputText
            placeholder="Restaurant Name"
            value={data.restaurantName}
            onChange={(e) => handleChange(e, 'restaurantName')}
            disabled={isView}
            style={{ flex: 1 }}
          />
          <InputText
            placeholder="Email"
            value={data.userdto.email}
            onChange={(e) => handleUserChange(e, 'email')}
            disabled={isView}
            style={{ flex: 1 }}
          />
        </div>
        {/* Owner Name, Contact, and Location */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <InputText
            placeholder="Owner Name"
            value={data.userdto.name}
            onChange={(e) => handleUserChange(e, 'name')}
            disabled={isView}
            style={{ flex: 1 }}
          />
          <InputText
            placeholder="Contact Number"
            value={data.userdto.phoneNumber}
            onChange={(e) => handleUserChange(e, 'phoneNumber')}
            disabled={isView}
            style={{ flex: 1 }}
          />
          <InputText
            placeholder="Location"
            value={data.location}
            onChange={(e) => handleChange(e, 'location')}
            disabled={isView}
            style={{ flex: 1 }}
          />
        </div>


        {/* Description */}
        <label>Description</label>
        <InputTextarea
          placeholder="Description"
          value={data.description}
          onChange={(e) => handleChange(e, 'description')}
          disabled={isView}
          autoResize
          rows={3}
          style={{ width: '100%' }}
        />
        {/* Rating */}
        <label>Ratings</label>
        <InputText
          type="number"
          placeholder="Rating (0-5)"
          value={data.rating}
          onChange={(e) => handleChange({ target: { value: parseFloat(e.target.value) || 0 } }, 'rating')}
          disabled={isView}
          min={0}
          max={5}
        />



        {/* Address Fields */}
        <h4 style={{ margin: '0.5rem 0 0' }}>Address</h4>
        <InputText
          placeholder="Street"
          value={data.addressdto.street}
          onChange={(e) => handleAddressChange(e, 'street')}
          disabled={isView}
        />
        <div style={{ display: 'flex', gap: '1rem' }}>
          <InputText
            placeholder="City"
            value={data.addressdto.city}
            onChange={(e) => handleAddressChange(e, 'city')}
            disabled={isView}
            style={{ flex: 1 }}
          />
          <InputText
            placeholder="State"
            value={data.addressdto.state}
            onChange={(e) => handleAddressChange(e, 'state')}
            disabled={isView}
            style={{ flex: 1 }}
          />
        </div>
        <InputText
          placeholder="Pincode"
          value={data.addressdto.pincode}
          onChange={(e) => handleAddressChange(e, 'pincode')}
          disabled={isView}
        />

        <h4 style={{ margin: '0.5rem 0 0' }}>User</h4>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <InputText
            placeholder="Username"
            value={data.userdto.username}
            onChange={(e) => handleUserChange(e, 'username')}
            disabled={isView}
            style={{ flex: 1 }}
          />
          {!isView && (
            <Password
              placeholder="Password"
              value={data.userdto.password}
              onChange={(e) => handleUserChange(e, 'password')}
              toggleMask
              feedback={false}
              style={{ flex: 1 }}
            />
          )}
        </div>



        {/* Status Checkbox */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox
            inputId="status"
            checked={data.status === 'ACTIVE'}
            onChange={(e) => {
              const newStatus = e.checked ? 'ACTIVE' : 'INACTIVE';
              setData(prev => ({ ...prev, status: newStatus }));
            }}
            disabled={isView}
          />
          <label htmlFor="status" style={{ marginLeft: '0.5rem' }}>
            {data.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE'}
          </label>
        </div>

        {/* Action Buttons */}
        {!isView && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button label="Cancel" className="p-button-text" onClick={onHide} style={{ marginRight: '0.5rem' }} />
            <Button
              label={isEdit ? 'Update Restaurant' : 'Add Restaurant'}
              onClick={handleSubmit}
              style={{ backgroundColor: '#f97316', border: 'none' }}
            />
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default RestaurantDialog;
