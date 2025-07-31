import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    // Extract token from query params
    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    const handleReset = async () => {
        setError('');
        setSuccess('');
        if (!newPassword || !confirmPassword) {
            setError('All fields are required.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (!token) {
            setError('Invalid or missing token.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:9002/api/auth/reset-password', {
                token,
                newPassword
            });
            setSuccess('Password reset successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data);
            } else {
                setError('Failed to reset password.');
            }
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff8ee' }}>
            <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '8px' }}>Reset Password</h2>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '24px' }}>
                    Enter your new password below
                </p>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#333' }}>New Password</label>
                <InputText type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={{ width: '100%', marginBottom: '16px' }} />
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#333' }}>Confirm Password</label>
                <InputText type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={{ width: '100%', marginBottom: '16px' }} />
                {error && <p style={{ color: 'red', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>{error}</p>}
                {success && <p style={{ color: 'green', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>{success}</p>}
                <Button label="Reset Password" className="w-full border-none" style={{ width: '100%', backgroundColor: '#ffaa00', color: 'white', fontWeight: 'bold', borderRadius: '6px', padding: '12px 0', marginBottom: '16px' }} onClick={handleReset} />
            </div>
        </div>
    );
} 
