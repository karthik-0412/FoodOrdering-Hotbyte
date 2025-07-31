import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import 'primereact/resources/themes/lara-light-blue/theme.css'; // or your theme
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function RestaurantProfile() {
  const [profile, setProfile] = useState({
    restaurantName: '',
    description: '',
    rating: 0,
    status: '',
    location: '',
    deliveryRadius: '',
    minOrderAmount: '',
    openingTime: null,
    closingTime: null,
    totalOrders: 0,
    monthlyRevenue: 0,
    address: {
      addressId: 0,
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    user: {
      name: '',
      email: '',
      phoneNumber: ''
    }
  });
  const nav = useNavigate();
    const handleClick=()=>{
        nav("/change-password")
    }


  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('user.')) {
      const field = name.split('.')[1];
      setProfile({ ...profile, user: { ...profile.user, [field]: value } });
    } else if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setProfile({ ...profile, address: { ...profile.address, [field]: value } });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };
  useEffect(() => {
    const restaurantId = localStorage.getItem("restaurantId");
    const token = localStorage.getItem("token");

    if (!restaurantId || !token) {
      console.warn("Missing token or restaurant ID");
      return;
    }

    const fetchProfileAndOrders = async () => {
      try {
        // 1. Fetch profile
        const profileRes = await axios.get(`http://localhost:9002/api/restaurant/${restaurantId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = profileRes.data;

        // 2. Fetch orders
        const orderRes = await axios.get(
          `http://localhost:9002/api/order/restaurant/${restaurantId}/orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const orders = orderRes.data || [];
        const activeOrders = orders.filter(order =>
          ['placed', 'confirmed', 'preparing', 'ready'].includes(order.status?.toLowerCase())
        );

        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

        const parseTime = (value) => {
          if (!value) return null;
          try {
            return new Date(`1970-01-01T${value}`);
          } catch {
            return null;
          }
        };

        // 3. Set profile state
        setProfile(prevProfile => ({
          ...prevProfile,
          restaurantName: data.restaurantName,
          description: data.description,
          location: data.location,
          rating: data.rating,
          status: data.status,
          deliveryRadius: parseFloat(data.deliveryRadius), // ✅ correct
          minOrderAmount: parseFloat(data.minOrderAmount), // ✅ correct

          openingTime: parseTime(data.openingTime),
          closingTime: parseTime(data.closingTime),




          totalOrders: activeOrders.length,
          monthlyRevenue: totalRevenue,
          address: {
            ...prevProfile.address,
            ...data.addressdto,
          },
          user: {
            ...prevProfile.user,
            ...data.userdto,
          }
        }));
      } catch (err) {
        console.error("Error loading profile or orders", err);
        alert("Failed to load profile data.");
      }
    };

    fetchProfileAndOrders();
  }, []);

  const handleSave = async () => {
    try {
      const restaurantId = localStorage.getItem('restaurantId');
      const token = localStorage.getItem('token');

      if (!restaurantId || !token) {
        alert("Missing restaurant ID or authentication token");
        return;
      }

      const payload = {
        restaurantName: profile.restaurantName,
        description: profile.description,
        location: profile.location,
        rating: profile.rating,
        status: profile.status,
        deliveryRadius: parseFloat(profile.deliveryRadius),
        minOrderAmount: parseFloat(profile.minOrderAmount),
        openingTime: profile.openingTime?.toTimeString().substring(0, 5),
        closingTime: profile.closingTime?.toTimeString().substring(0, 5),


        addressdto: {
          addressId: profile.address?.addressId || 1, // Replace 1 with actual id
          street: profile.address.street,
          city: profile.address.city,
          state: profile.address.state,
          pincode: profile.address.pincode,
        },
        userdto: {
          name: profile.user.name,
          phoneNumber: profile.user.phoneNumber,
          email: profile.user.email,
        }
      };

      const response = await axios.put(
        `http://localhost:9002/api/restaurant/${restaurantId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert('Profile updated successfully!');
      console.log('Updated:', response.data);
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update restaurant profile');
    }
  };



  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '10px' }}>Restaurant Profile</h2>
      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
        Manage your restaurant information and settings
      </p>

      <div style={{
        backgroundColor: '#ffffff',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ flex: '1 1 45%' }}>
            <label style={labelStyle}>Restaurant Name</label>
            <InputText name="restaurantName" value={profile.restaurantName} onChange={handleChange} style={inputStyle} />
          </div>
          <div style={{ flex: '1 1 45%' }}>
            <label style={labelStyle}>Owner Name</label>
            <InputText
              name="user.name"
              value={profile.user.name}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={{ flex: '1 1 45%' }}>
            <label style={labelStyle}>Email Address</label>
            <InputText name="user.email" value={profile.user.email} onChange={handleChange} style={inputStyle} />
          </div>
          <div style={{ flex: '1 1 45%' }}>
            <label style={labelStyle}>Phone Number</label>
            <InputText name="user.phoneNumber" value={profile.user.phoneNumber} onChange={handleChange} style={inputStyle} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '75px' }}>
            {/* Other Fields like Name, Email, Phone */}

            <div style={{ flex: '1 1 45%' }}>
              <label style={{ ...labelStyle, fontWeight: '1000', fontSize: '16px' }}>Location</label>
              <label style={labelStyle}>Location</label>
              <InputText
                name="location"
                value={profile.location || ''}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={{ flex: '1 1 45%' }}>
              <label style={{ ...labelStyle, fontWeight: '1000', fontSize: '16px' }}>Timings</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '35px' }}>
                <div style={{ flex: '1 1 45%' }}>
                  <label style={labelStyle}>Opening Time</label>
                  <Calendar
                    value={profile.openingTime}
                    onChange={(e) => setProfile({ ...profile, openingTime: e.value })}
                    timeOnly
                    hourFormat="12"
                    showIcon
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: '1 1 45%' }}>
                  <label style={labelStyle}>Closing Time</label>
                  <Calendar
                    value={profile.closingTime}
                    onChange={(e) => setProfile({ ...profile, closingTime: e.value })}
                    timeOnly
                    hourFormat="12"
                    showIcon
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          </div>



        </div>

        <div style={{ marginTop: '20px' }}>
          <h4 style={{ fontWeight: '600', fontSize: '16px', marginBottom: '10px' }}>Address Details</h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: '1 1 100%' }}>
                <label style={labelStyle}>Street</label>
                <InputText name="address.street" value={profile.address.street} onChange={handleChange} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ flex: '1 1 30%' }}>
                <label style={labelStyle}>City</label>
                <InputText name="address.city" value={profile.address.city} onChange={handleChange} style={inputStyle} />
              </div>
              <div style={{ flex: '1 1 30%' }}>
                <label style={labelStyle}>State</label>
                <InputText name="address.state" value={profile.address.state} onChange={handleChange} style={inputStyle} />
              </div>
              <div style={{ flex: '1 1 30%' }}>
                <label style={labelStyle}>Pincode</label>
                <InputText name="address.pincode" value={profile.address.pincode} onChange={handleChange} style={inputStyle} />
              </div>
            </div>
          </div>

        </div>


        <div style={{ marginTop: '20px' }}>
          <label style={{ ...labelStyle, marginBottom: '10px', fontWeight: '1000', fontSize: '16px' }}>Restaurant Description</label>
          <InputTextarea
            name="description"
            value={profile.description}
            onChange={handleChange}
            rows={3}
            autoResize
            style={textareaStyle}
          />
        </div>

        {/* Delivery Settings */}
        <div style={{ marginTop: '30px' }}>
          <h4 style={{ fontWeight: '600', fontSize: '16px', marginBottom: '10px' }}>Delivery Settings</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: '1 1 45%' }}>
              <label style={labelStyle}>Delivery Radius (km)</label>
              <InputText name="deliveryRadius" value={profile.deliveryRadius} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={{ flex: '1 1 45%' }}>
              <label style={labelStyle}>Minimum Order Amount (₹)</label>
              <InputText name="minOrderAmount" value={profile.minOrderAmount} onChange={handleChange} style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Security */}
        <h4>Security</h4>
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <Button label="Change Password" onClick={handleClick}/>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', gap: '10px', flexWrap: 'wrap' }}>
          <div style={statBoxStyle}>
            <div style={statLabelStyle}>Total Orders</div>
            <div style={statValueStyle}>{profile.totalOrders.toLocaleString()}</div>
          </div>
          <div style={statBoxStyle}>
            <div style={statLabelStyle}>Average Rating</div>
            <div style={statValueStyle}>{profile.rating}</div>
          </div>
          <div style={statBoxStyle}>
            <div style={statLabelStyle}>Monthly Revenue</div>
            <div style={statValueStyle}>₹{profile.monthlyRevenue.toLocaleString()}</div>
          </div>
        </div>

        <div style={{ textAlign: 'right', marginTop: '30px' }}>
          <Button label="Save Changes" icon="pi pi-check" className="p-button-sm p-button-warning" onClick={handleSave} />
        </div>
      </div>
    </div>
  );
}

// Styles remain unchanged
const labelStyle = {
  fontSize: '14px',
  fontWeight: '500',
  marginBottom: '6px',
  display: 'block'
};

const inputStyle = {
  width: '100%'
};

const textareaStyle = {
  width: '100%',
  resize: 'vertical'
};

const statBoxStyle = {
  backgroundColor: '#f3f4f6',
  borderRadius: '12px',
  padding: '16px',
  flex: '1 1 30%',
  textAlign: 'center',
  minWidth: '150px'
};

const statLabelStyle = {
  fontSize: '14px',
  color: '#6b7280'
};

const statValueStyle = {
  fontSize: '18px',
  fontWeight: '600',
  marginTop: '4px'
};
