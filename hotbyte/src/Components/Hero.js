import React from 'react';
import { Galleria } from 'primereact/galleria';
import { PrimeIcons } from 'primereact/api';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
    const navigate = useNavigate();

    const isLoggedIn = !!localStorage.getItem('token'); // Change based on your auth logic

    const handleClick = () => {
        if (isLoggedIn) {
            navigate('/menu');
        } else {
            navigate('/login');
        }
    };
    const images = [
        { pic1: '/services/Photos/pic1.jpg', alt: 'Image 1' },
        { pic1: '/services/Photos/pic2.jpg', alt: 'Image 2' },
        { pic1: '/services/Photos/pic3.jpg', alt: 'Image 3' }
    ];

    const responsiveOptions = [
        { breakpoint: '99px', numVisible: 4 },
        { breakpoint: '767px', numVisible: 3 },
        { breakpoint: '575px', numVisible: 1 }
    ];

    const itemTemplate = (item) => (
        <img src={item.pic1} alt={item.alt} style={{ width: '100%',height: '650px',objectFit: 'cover',  display: 'block' }} />
    );

    // const thumbnailTemplate = (item) => (
    //     <img src={item.pic1} alt={item.alt} style={{ display: 'block' }} />
    // );
    

    return (
        <div style={{ position: 'relative' }}>
            <div className="card">
                <Galleria
                    value={images}
                    responsiveOptions={responsiveOptions}
                    numVisible={5}
                    // style={{ height: '40px' }}
                    item={itemTemplate}
                    showThumbnails={false}
                    // thumbnail={thumbnailTemplate}
                    circular
                    autoPlay
                    transitionInterval={2000}
                />
            </div>
            <div
                className="hero-overlay"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    color: 'white',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)', // optional dark overlay for readability
                    padding: '20px'
                }}
            >
                <h1 style={{ fontSize: '6rem', fontWeight: 'bold' }}>
                    Delicious Food, Delivered Fast
                </h1>
                <p style={{ fontSize: '1.6rem', maxWidth: '600px' }}>
                    Order from your favorite restaurants and get fresh, hot meals delivered to your doorstep in minutes.
                </p>
                <div style={{ marginTop: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <Button
                    onClick={handleClick}
                        style={{
                            backgroundColor: 'white',
                            color: '#ffa500',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 30px',
                            fontSize: '1.2rem',
                            cursor: 'pointer'
                        }}
                    >
                        Order Now
                    </Button>
                    <Button
                    onClick={handleClick}
                        style={{
                            backgroundColor: 'white',
                            color: '#ffa500',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 30px',
                            fontSize: '1.2rem',
                            cursor: 'pointer'
                        }}
                    >
                        <i className={PrimeIcons.SEARCH} style={{ marginRight: '8px' }} />
                        Browse Restaurants
                    </Button>
                </div>
            </div>
        </div>
    );
}
