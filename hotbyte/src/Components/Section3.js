import React from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

export default function Section3() {
    const navigate = useNavigate();

    const isLoggedIn = !!localStorage.getItem('token'); // Change based on your auth logic

    const handleClick = () => {
        if (isLoggedIn) {
            navigate('/menu');
        } else {
            navigate('/login');
        }
    };
    
    return (
        <div
            className="cta-section"
            style={{
                backgroundColor: '#141924', // dark background
                color: 'white',
                textAlign: 'center',
                padding: '50px 30px'
            }}
        >
            <h2 style={{ fontSize: '2.8rem', marginBottom: '20px' }}>Ready to Order?</h2>
            <p style={{ fontSize: '1.3rem', maxWidth: '600px', margin: '0 auto 30px auto' }}>
                Join thousands of satisfied customers who trust HotByte for their food delivery needs.
            </p>
            <Button
                label="Get Started today"
                onClick={handleClick}
                style={{
                    backgroundColor: 'orange',
                    border: 'none',
                    color: 'white',
                    padding: '15px 35px',
                    fontSize: '1.3rem',
                    borderRadius: '10px'
                    
                    
                }}
            />
        </div>
    );
}
