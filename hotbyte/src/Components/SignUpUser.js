import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function SignUpUser() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        age: '',
        gender: '',
        mobileNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
    });

    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState('');

    const genders = [
        { label: 'Male', value: 'MALE' },
        { label: 'Female', value: 'FEMALE' },
        { label: 'Other', value: 'OTHER' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };
    const flexRowStyle = {
    display: 'flex',
    gap: '20px',
    marginBottom: '16px',
};

const flexFieldStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
};


    const handleDropdownChange = (e) => {
        setFormData(prev => ({
            ...prev,
            gender: e.value
        }));
    };

    const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
    }
    if (!agreed) {
        setError('Please agree to the Terms and Conditions');
        return;
    }

    const payload = {
        fullName: formData.fullName,
        age: parseInt(formData.age),
        gender: formData.gender,
        mobileNumber: formData.mobileNumber,
        userdto: {
            username: formData.email,
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
            phoneNumber: formData.mobileNumber,
            role: 'CUSTOMER',
            status: 'ACTIVE'
        },
        address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode
        }
    };

    try {
        const response = await axios.post('http://localhost:9002/api/customer/register', payload);
        console.log('Success:', response.data);
        setError(''); // clear error if any
        alert('Account created successfully!');
        setTimeout(() => {
            navigate('/login'); // redirect after 2s
        }, 2000);
        // Optionally reset form
        setFormData({
            fullName: '',
            age: '',
            gender: '',
            mobileNumber: '',
            email: '',
            password: '',
            confirmPassword: '',
            street: '',
            city: '',
            state: '',
            pincode: '',
        });
        setAgreed(false);
    } catch (err) {
        console.error('Error:', err);
        const message = err.response?.data?.message || 'Registration failed. Please try again.';
        setError(message);
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
                padding: '24px',
            }}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    padding: '32px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    width: '100%',
                    maxWidth: '1000px',
                }}
            >
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '8px' }}>
                    Create an Account
                </h2>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '24px' }}>
                    Sign up to order delicious food seamlessly
                </p>

                <div style={gridContainerStyle}>
                    {/* Full Name */}
                    <div style={fieldWrapperStyle}>
                        <label style={labelStyle}>Full Name</label>
                        <InputText
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            style={inputStyle}
                        />
                    </div>

                    {/* Age and Gender in one row */}
<div style={flexRowStyle}>
    <div style={flexFieldStyle}>
        <label style={labelStyle}>Age</label>
        <InputText
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            placeholder="Enter your age"
            style={inputStyle}
        />
    </div>

    <div style={flexFieldStyle}>
        <label style={labelStyle}>Gender</label>
        <Dropdown
            value={formData.gender}
            options={genders}
            onChange={handleDropdownChange}
            placeholder="Select your gender"
            style={{ width: '100%', marginBottom: '16px' }}
        />
    </div>
</div>


                    {/* Mobile Number */}
                    <div style={fieldWrapperStyle}>
                        <label style={labelStyle}>Mobile Number</label>
                        <InputText
                            name="mobileNumber"
                            value={formData.mobileNumber}
                            onChange={handleChange}
                            placeholder="Enter your mobile number"
                            style={inputStyle}
                        />
                    </div>

                    {/* Street */}
                    <div style={fieldWrapperStyle}>
                        <label style={labelStyle}>Street</label>
                        <InputText
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                            placeholder="Street"
                            style={inputStyle}
                        />
                    </div>

                    {/* City, State, and Pincode in one row */}
<div style={flexRowStyle}>
    <div style={flexFieldStyle}>
        <label style={labelStyle}>City</label>
        <InputText
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            style={inputStyle}
        />
    </div>

    <div style={flexFieldStyle}>
        <label style={labelStyle}>State</label>
        <InputText
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
            style={inputStyle}
        />
    </div>

    <div style={flexFieldStyle}>
        <label style={labelStyle}>Pincode</label>
        <InputText
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="Pincode"
            style={inputStyle}
        />
    </div>
</div>


                    {/* Email */}
                    <div style={fieldWrapperStyle}>
                        <label style={labelStyle}>Email</label>
                        <InputText
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            style={inputStyle}
                        />
                    </div>

                    {/* Password */}
                    <div style={fieldWrapperStyle}>
                        <label style={labelStyle}>Password</label>
                        <Password
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            toggleMask
                            placeholder="Enter your password"
                            inputStyle={{ width: '100%', padding: '10px',paddingRight:'280px'  }}
                            style={{ width: '100%', marginBottom: '16px' }}
                        />
                    </div>

                    {/* Confirm Password */}
                    <div style={fieldWrapperStyle}>
                        <label style={labelStyle}>Confirm Password</label>
                        <Password
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            toggleMask
                            placeholder="Confirm your password"
                            inputStyle={{ width: '100%', padding: '10px',paddingRight:'280px' }}
                            style={{ width: '100%', marginBottom: '16px' }}
                        />
                    </div>
                </div>

                {error && (
                    <p style={{ color: 'red', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>
                        {error}
                    </p>
                )}

                {/* Terms and Conditions */}
                <div style={{ marginBottom: '16px' }}>
                    <Checkbox
                        inputId="agree"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.checked)}
                    />
                    <label htmlFor="agree" style={{ marginLeft: '8px', fontSize: '14px' }}>
                        I agree to the{' '}
                        <Link to="/terms" style={{ textDecoration: 'none', color: '#ffaa00', fontWeight: 500 }}>
                            Terms and Conditions
                        </Link>
                    </label>
                </div>

                <Button
                    label="Create Account"
                    className="w-full border-none"
                    onClick={handleSubmit}
                    style={{
                        width: '100%',
                        backgroundColor: '#ffaa00',
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: '6px',
                        padding: '12px 0',
                        marginTop: '16px',
                        marginBottom: '16px',
                    }}
                />

                <p style={{ textAlign: 'center', fontSize: '14px' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ textDecoration: 'none', color: '#ffaa00', fontWeight: 500 }}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

const labelStyle = {
    display: 'block',
    marginBottom: '4px',
    fontWeight: '500',
    color: '#333',
};

const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '8px',
};

const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '16px',
};

const fieldWrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
};
