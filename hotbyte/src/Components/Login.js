import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import UserPassword from './UI/UserPassword';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SideBarUser from './UI/SideBarUser';
import { Password } from 'primereact/password';
import Footer from './Footer';


export default function Login() {
    let [token, setToken] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();


    const handleLogin = async () => {
        if (!username || !password) {
            alert("All fields are required");
            return;
        }

        try {
            const userobj = {
                username: username,
                password: password
            };

            const resp = await axios.post("http://localhost:9002/api/auth/login", userobj);

            if (resp && resp.data && resp.data.token) {
                const recievedToken = resp.data.token;
                setToken(recievedToken);
                localStorage.setItem('token', recievedToken);

                const user = await axios.get("http://localhost:9002/api/users/userDetails", {
                    headers: { 'Authorization': 'Bearer ' + recievedToken }
                });

                localStorage.setItem('role', user.data.role);

                if (user.data.role === 'RESTAURANT' && user.data.restaurantId) {
                    localStorage.setItem('restaurantId', user.data.restaurantId);
                }

                if (user.data.customerId) {
                    localStorage.setItem('customerId', user.data.customerId);
                    console.log("Saved customerId:", user.data.customerId);
                } else {
                    console.warn("No customerId found in response");
                }

                switch (user.data.role) {
                    case 'CUSTOMER':
                        navigate('/');
                        break;
                    case 'RESTAURANT':
                        navigate('/restaurant/dashboard');
                        break;
                    case 'ADMIN':
                        navigate('/admin/dashboard');
                        break;
                    default:
                        navigate('/login');
                        break;
                }
            } else {
                alert("Login response missing token.");
            }
        } catch (err) {
            console.error("Login failed:", err);
            alert("Login failed. Please check your credentials.");
        }
    }



    return (<>
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff8ee',
            }}
        >
            {/* <SideBarUser/> */}
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
                    Welcome Back
                </h2>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '24px' }}>
                    Sign in to your account to continue ordering<br /> delicious food
                </p>

                {/* Email */}
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#333' }}>
                    Email
                </label>
                <i className="pi pi-envelope" style={{ fontSize: '1rem', color: '#6c757d', marginRight: '8px' }} />
                <span className="p-input-icon-left" style={{ marginBottom: '16px' }}>
                    <InputText type='text'
                        placeholder="Enter your Email"
                        style={{ width: '100%', padding: '10px', paddingLeft: '10px', paddingRight: '40px', marginRight: '80px' }}
                        onChange={($e) => setUsername($e.target.value)}
                    />
                </span>

                {/* Password */}
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#333' }}>
                    Password
                </label>
                <span className="p-input-icon-left" style={{ display: 'block', marginBottom: '24px' }}>

                    <i className="pi pi-lock" style={{ fontSize: '1rem', color: '#6c757d', marginRight: '8px' }} />

                    <Password type='password'
                        placeholder="Enter your Password"
                        toggleMask
                        feedback={false}
                        style={{ width: '90%', marginLeft: '22px' }}
                        inputStyle={{ marginRight: '6vw', width: '102%' }}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </span>
                {/* Remember Me checkbox and Forgot Password link */}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            style={{ marginRight: '8px' }}
                        />
                        <label htmlFor="rememberMe" style={{ fontSize: '14px', color: '#333' }}>
                            Remember Me
                        </label>
                    </div>
                    <Link to="/forgot-password" style={{ fontSize: '14px', color: '#ffaa00', textDecoration: 'none', fontWeight: '500' }}>
                        Forgot Password?
                    </Link>
                </div>


                {/* Sign in button */}
                <Button
                    label="Sign in"
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
                    onClick={() => handleLogin()}
                />

                <p style={{ textAlign: 'center', fontSize: '14px' }}>
                    Don't have an account?{' '}
                    <span
                        style={{
                            color: '#ffaa00',
                            fontWeight: '500',
                            cursor: 'pointer',
                        }}
                    >
                        <Link to="/signup" style={{ textDecoration: 'none', color: '#ffaa00' }}>
                            Sign Up
                        </Link>
                    </span>
                </p>
            </div>
        </div>
        {/* <Footer/> */}
    </>);
}
