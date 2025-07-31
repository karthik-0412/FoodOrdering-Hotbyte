import React, { useState } from 'react';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import CustomMenubar from './CustomMenubar';

export default function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            alert("All fields are required.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("New and Confirm Password do not match.");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            await axios.post(
                'http://localhost:9002/api/auth/change-password',
                {
                    oldPassword,
                    newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Password changed successfully.");
            // Step 2: Fetch user details using same token
        const userResp = await axios.get("http://localhost:9002/api/users/userDetails", {
            headers: { Authorization: `Bearer ${token}` }
        });

        const user = userResp.data;

        // Update localStorage if needed
        localStorage.setItem("role", user.role);
        if (user.restaurantId) {
            localStorage.setItem("restaurantId", user.restaurantId);
        }
        if (user.customerId) {
            localStorage.setItem("customerId", user.customerId);
        }

        // Step 3: Navigate based on role
        switch (user.role) {
            case 'CUSTOMER':
                navigate('/');
                break;
            case 'RESTAURANT':
                navigate('/resdash');
                break;
            // case 'ADMIN':
            //     navigate('/admindashboard');
            //     break;
            default:
                navigate('/login');
                break;
        }
        } catch (error) {
            console.error("Password change failed:", error);
        if (error.response?.data?.message) {
            alert("Error: " + error.response.data.message);
        } else {
            alert("Password change failed. Please try again.");
        }
        }
    };

    return (<>
    <CustomMenubar />
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff8ee',
            }}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    padding: '32px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    width: '100%',
                    maxWidth: '400px',
                }}
            >
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '8px' }}>
                    Change Password
                </h2>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '24px' }}>
                    Update your account password
                </p>

                {/* Old Password */}
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#333' }}>
                    Old Password
                </label>
                <span className="p-input-icon-left" style={{ display: 'block', marginBottom: '16px' }}>
                    <i className="pi pi-lock" style={{ fontSize: '1rem', color: '#6c757d', marginRight: '8px' }} />
                    <Password
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Enter old password"
                        toggleMask
                        feedback={false}
                        style={{ width: '90%', marginLeft: '22px' }}
                        inputStyle={{ width: '102%' ,paddingRight: '8.5rem'}}
                    />
                </span>

                {/* New Password */}
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#333' }}>
                    New Password
                </label>
                <span className="p-input-icon-left" style={{ display: 'block', marginBottom: '16px' }}>
                    <i className="pi pi-lock" style={{ fontSize: '1rem', color: '#6c757d', marginRight: '8px' }} />
                    <Password
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        toggleMask
                        // feedback={false}
                        style={{ width: '90%', marginLeft: '22px' }}
                        inputStyle={{ width: '102%' ,paddingRight: '8.5rem'}}
                    />
                </span>

                {/* Confirm Password */}
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#333' }}>
                    Confirm Password
                </label>
                <span className="p-input-icon-left" style={{ display: 'block', marginBottom: '24px' }}>
                    <i className="pi pi-lock" style={{ fontSize: '1rem', color: '#6c757d', marginRight: '8px' }} />
                    <Password
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        toggleMask
                        // feedback={false}
                        style={{ width: '90%', marginLeft: '22px' }}
                        inputStyle={{ width: '102%' , paddingRight: '8.5rem' }}
                    />
                </span>

                <Button
                    label="Change Password"
                    className="w-full border-none"
                    style={{
                        width: '99.5%',
                        backgroundColor: '#ffaa00',
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: '6px',
                        padding: '12px 0',
                        marginBottom: '16px',
                    }}
                    onClick={handleChangePassword}
                />
            </div>
        </div>
        <Footer />
    </>);
}
