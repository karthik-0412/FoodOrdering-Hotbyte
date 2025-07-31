// import React from 'react';
import { Card } from 'primereact/card';

export default function Section1() {
    const features = [
        {
            icon: 'pi pi-truck',
            title: 'Fast Delivery',
            description: 'Get your food delivered in 30 minutes or less'
        },
        {
            icon: 'pi pi-shield',
            title: 'Safe & Secure',
            description: 'Your payments and data are completely secure'
        },
        {
            icon: 'pi pi-users',
            title: 'Quality Partners',
            description: 'Partnered with the best restaurants in town'
        },
        {
            icon: 'pi pi-star',
            title: 'Top Rated',
            description: 'Highly rated by thousands of satisfied customers'
        }
    ];

    return (
        <div className="why-choose-us" style={{ textAlign: 'center', padding: '30px',fontSize: '1rem' }}>
            <h2 style={{fontSize:'2.5rem'}}>Why Choose HotByte?</h2>
            <p>Experience the best food delivery service in town</p>
            <div
                className="features-grid"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                    marginTop: '30px'
                }}
            >
                {features.map((feature, index) => (
                    <Card
                        key={index}
                        style={{
                            padding: '20px',
                            border: '1px solid #ddd',
                            borderRadius: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                            transition: 'transform 0.2s',
                            animation : 'fadeIn 0.5s ease-in-out',
                            
                        }}
                    >
                        <div
                            style={{
                                fontSize: '1vh', // increase icon size
                                color: '#ffa500', // adjust to your brand orange
                                marginBottom: '15px',
                                
                                 // white background for icon
                            }}
                        >
                            <i className={feature.icon} style={{fontSize:'7vh'}}></i>
                        </div>
                        <h4 style={{fontSize:'2.8vh'}}>{feature.title}</h4>
                        <p style={{ margin: 0 ,fontSize: '1.8vh',}}>{feature.description}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
}
