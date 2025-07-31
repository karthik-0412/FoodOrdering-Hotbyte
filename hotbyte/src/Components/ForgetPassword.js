import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { MoveLeft } from 'lucide-react';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const toast = useRef(null);

    const handleReset = async () => {
        if (!email) {
            toast.current.show({
                severity: 'warn',
                summary: 'Missing Email',
                detail: 'Please enter your email.',
                life: 3000,
            });
            return;
        }

        try {
            const response = await axios.post("http://localhost:9002/api/auth/request-reset", {
                email: email,
            });
            toast.current.show({
                severity: 'success',
                summary: 'Link Sent',
                detail: response.data?.message || 'Password reset link has been sent.',
                life: 3000,
            });
        } catch (error) {
            console.error(error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: error?.response?.data?.message || 'Something went wrong. Please try again.',
                life: 3000,
            });
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff8ee',
            }}
        >
            <Toast ref={toast} />

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
                    Forgot Password
                </h2>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '24px' }}>
                    Enter your registered email to receive password reset instructions
                </p>

                {/* Email Field */}
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#333' }}>
                    Email
                </label>
                <span className="p-input-icon-left" style={{ marginBottom: '16px' }}>
                    <i className="pi pi-envelope" style={{ fontSize: '1rem', color: '#6c757d', marginRight: '8px' }} />
                    <InputText
                        type="text"
                        placeholder="Enter your registered email"
                        style={{ width: '100%', padding: '10px', marginLeft: '20px', paddingRight: '100px' }}
                        // inputStyle={{ paddingRight: '90px' }}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </span>
                <p style={{ marginLeft: '24px', marginTop: '-14px', fontSize: '12px' }}>
                    We'll send a password reset link to this email
                </p>

                {/* Reset Button */}
                <Button
                    label="Send Reset Link"
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
                    onClick={handleReset}
                />

                {/* Back to Login Link with Lucide Icon */}
                <p style={{ textAlign: 'center', fontSize: '14px' }}>
                    <Link to="/login" style={{
                        textDecoration: 'none',
                        color: '#ffaa00',
                        fontWeight: '500',
                        display: 'inline-flex',
                        alignItems: 'center'
                    }}>
                        <MoveLeft size={16} style={{ marginRight: '6px' }} />
                        Back to Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
