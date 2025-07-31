import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import { Avatar } from "primereact/avatar";
import { Divider } from "primereact/divider";
import { InputIcon } from "primereact/inputtext";
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function ProfileSettings() {
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [addressId, setAddressId] = useState("");
  const [dietaryPreferences, setDietaryPreferences] = useState("");
  const [allergies, setAllergies] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [customerId, setCustomerId] = useState(null);
  const [age, setAge] = useState("");
  const genders = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];
const nav = useNavigate();
    const handleClick=()=>{
        nav("/change-password")
    }
  const [notifications, setNotifications] = useState([
  {
    key: "email",
    label: "Email Notifications",
    description: "Receive email notifications about order updates",
    enabled: true,
  },
  {
    key: "sms",
    label: "SMS Notifications",
    description: "Receive SMS notifications for order status",
    enabled: true,
  },
  {
    key: "promotional",
    label: "Promotional Emails",
    description: "Receive promotional emails and special offers",
    enabled: false,
  },
  {
    key: "orderUpdates",
    label: "Order Updates",
    description: "Get notified about order confirmations and delivery updates",
    enabled: true,
  },
]);


  const toggleNotification = (key) => {
  setNotifications((prev) =>
    prev.map((notif) =>
      notif.key === key ? { ...notif, enabled: !notif.enabled } : notif
    )
  );
};

  useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError("");
            setSuccess("");
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:9002/api/customer/get", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = res.data;
                setCustomerId(data.customerId);
                setFullName(data.fullName || "");
                setAge(data.age || "");
                setGender(data.gender || "");
                setPhone((data.userdto && data.userdto.phoneNumber) || "");
                setEmail((data.userdto && data.userdto.email) || "");
                if (data.address) {
                    setAddressId(data.address.addressId || "");
                    setStreet(data.address.street || "");
                    setCity(data.address.city || "");
                    setState(data.address.state || "");
                    setPincode(data.address.pincode || "");
                }
            } catch (err) {
                setError("Failed to fetch profile data.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);


  return (
    <div style={{ maxWidth: "700px", margin: "10px auto", fontFamily: "sans-serif" }}>
      <h2>Profile Settings</h2>

      <div style={{ background: "#ff5722", color: "white", padding: "20px", borderRadius: "8px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "20px" }}>
        <Avatar label={fullName ? fullName.split(' ').map(n => n[0]).join('').toUpperCase() : "U"} size="xlarge" shape="circle" style={{ backgroundColor: "#ffffff33", color: "white" }} />
        <div>
          <h3 style={{ margin: 0 }}>{fullName || 'Customer User'}</h3>
          <p style={{ margin: 0 }}>{email || 'Email not available'}</p>
          <p style={{ margin: 0 }}>Customer Account</p>
        </div>
      </div>

      <Divider />

      <h4>Personal Information</h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
        <span>
          <label>Full Name</label>
          <InputText value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full Name" style={{ width: "100%" }} />
        </span>
        <span>
          <label>Email Address</label>
          <InputText value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" style={{ width: "100%" }} />
        </span>
        <span>
          <label>Phone Number</label>
          <InputText value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" style={{ width: "100%" }} />
        </span>
        <span>
          <label>Gender</label>
          <Dropdown
            value={gender}
            options={genders}
            onChange={(e) => setGender(e.value)}
            placeholder="Select Gender"
            style={{ width: "100%" }}
          />
        </span>
        <span>
  <label>Date of Birth</label>
  <Calendar
    value={dob}
    onChange={(e) => setDob(e.value)}
    placeholder="dd/mm/yyyy"
    dateFormat="dd/mm/yy"
    showIcon
    style={{ width: "100%" }}
  />
</span>
        <span>
          <label>Emergency Contact</label>
          <InputText value={emergencyContact} onChange={e => setEmergencyContact(e.target.value)} placeholder="Emergency contact number" style={{ width: "100%" }} />
        </span>
      </div>

      <Divider />

      <h4>Address Information</h4>
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
  <span>
    <label>Street</label>
    <InputText value={street} onChange={e => setStreet(e.target.value)} placeholder="Street" style={{ width: "100%" }} />
  </span>
  <span>
    <label>City</label>
    <InputText value={city} onChange={e => setCity(e.target.value)} placeholder="City" style={{ width: "100%" }} />
  </span>
  <span>
    <label>State</label>
    <InputText value={state} onChange={e => setState(e.target.value)} placeholder="State" style={{ width: "100%" }} />
  </span>
  <span>
    <label>Pincode</label>
    <InputText value={pincode} onChange={e => setPincode(e.target.value)} placeholder="Pincode" style={{ width: "100%" }} />
  </span>
</div>

      <Divider />

      <h4>Dietary Preferences & Allergies</h4>
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
  <span>
    <label>Dietary Preferences</label>
    <InputTextarea
      value={dietaryPreferences}
      onChange={e => setDietaryPreferences(e.target.value)}
      placeholder="e.g., Vegetarian, Vegan, Keto, etc."
      rows={3}
      style={{ width: "100%" }}
    />
  </span>
  <span>
    <label>Allergies</label>
    <InputTextarea
      value={allergies}
      onChange={e => setAllergies(e.target.value)}
      placeholder="e.g., Nuts, Dairy, Gluten, etc."
      rows={3}
      style={{ width: "100%" }}
    />
  </span>
</div>


      <Divider />

      {/* <h4>Account Statistics</h4>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        <div style={{ flex: 1, background: "#ff5722", color: "white", padding: "10px", borderRadius: "8px", textAlign: "center" }}>
          <p>Total Orders</p>
          <h2>24</h2>
        </div>
        <div style={{ flex: 1, background: "#4caf50", color: "white", padding: "10px", borderRadius: "8px", textAlign: "center" }}>
          <p>Total Spend</p>
          <h2>₹486.50</h2>
        </div>
        <div style={{ flex: 1, background: "#e91e63", color: "white", padding: "10px", borderRadius: "8px", textAlign: "center" }}>
          <p>Favorite Cuisine</p>
          <h2>Indian</h2>
        </div>
        <div style={{ flex: 1, background: "#673ab7", color: "white", padding: "10px", borderRadius: "8px", textAlign: "center" }}>
          <p>Member Since</p>
          <h2>2025</h2>
        </div>
      </div> */}

      {/* <Divider /> */}
<h4>Notification Preferences</h4>
<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
  {notifications.map((notif) => (
    <div
      key={notif.key}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#fff",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "15px",
      }}
    >
      <div>
        <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>{notif.label}</p>
        <p style={{ margin: 0, color: "#555", fontSize: "0.9em" }}>
          {notif.description}
        </p>
      </div>
      <InputSwitch
        checked={notif.enabled}
        onChange={() => toggleNotification(notif.key)}
      />
    </div>
  ))}
</div>

      <Divider />

      <h4>Security</h4>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <Button label="Change Password" onClick={handleClick} />
        {/* <Button label="Enable Two-Factor Authentication" /> */}
      </div>

      {/* Update Profile Button at the bottom */}
      <Button
        label={loading ? "Updating..." : "Update Profile"}
        style={{ background: "#ff5722", border: "none", width: "100%", marginTop: 20 }}
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          setError("");
          setSuccess("");
          try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:9002/api/customer/${customerId}`, {
              fullName,
              age: Number(age),
              gender,
              mobileNumber: phone,
              address: {
                addressId,
                street,
                city,
                state,
                pincode
              },
              userdto: {
                email,
                phoneNumber: phone
              }
            }, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setSuccess("Profile updated successfully!");
          } catch (err) {
            setError("Failed to update profile.");
          } finally {
            setLoading(false);
          }
        }}
      />
      {success && <div style={{ color: 'green', marginTop: 10 }}>{success}</div>}
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}

    </div>
  );
}