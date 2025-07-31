import React from 'react';
import { Image } from 'primereact/image';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer style={{
            backgroundColor: '#222',
            color: 'white',
            padding: '50px 20px 30px 20px',
            // borderTop: '2px solid #ff9900'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
            }}>

                {/* Logo */}
                <div style={{
                    flex: '1 1 220px',
                    marginBottom: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start', // left justify logo section
                }}>
                    <Image
                        src="/hotbytelogo.png"
                        alt="HotByte Logo"
                        width="200"
                        style={{ marginBottom: '10px' }}
                    />
                    <p style={{
                        margin: 0,
                        fontSize: '0.95rem',
                        lineHeight: '1.4',
                        color: 'grey',
                        maxWidth: '250px'
                    }}>
                        Your favorite food ordering platform. Fresh, fast, and delicious meals delivered right to your doorstep.
                    </p>
                </div>

                {/* Quick Links */}
                <div style={{
                    flex: '1 1 150px',
                    marginBottom: '20px',
                    textAlign: 'left' // left justify quick links
                }}>
                    <h4 style={{ marginBottom: '10px' }}>Quick Links</h4>
                    <ul style={{ listStyle: 'none', padding: 0, lineHeight: '1.8' }}>
                        <li><Link to={"./"} style={{ color: 'white', textDecoration: 'none' }}>Home</Link></li>
                        <li><Link to={"./menu"} style={{ color: 'white', textDecoration: 'none' }}>Menu</Link></li>
                        <li><Link to={"./about"} style={{ color: 'white', textDecoration: 'none' }}>About</Link></li>
                        <li><Link to={"./contact"} style={{ color: 'white', textDecoration: 'none' }}>Contact</Link></li>
                    </ul>
                </div>

                {/* Support */}
                <div style={{
                    flex: '1 1 150px',
                    marginBottom: '20px',
                    textAlign: 'left' // left justify support
                }}>
                    <h4 style={{ marginBottom: '10px' }}>Support</h4>
                    <ul style={{ listStyle: 'none', padding: 0, lineHeight: '1.8' }}>
                        <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Help Center</a></li>
                        <li><Link to={"./contact"} style={{ color: 'white', textDecoration: 'none' }}>Contact Us</Link></li>
                        <li><Link to={"./terms"} style={{ color: 'white', textDecoration: 'none' }}>Terms of Service</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div style={{
                    flex: '1 1 200px',
                    marginBottom: '20px',
                    textAlign: 'left' // left justify contact
                }}>
                    <h4 style={{ marginBottom: '10px' }}>Contact</h4>
                    <ul style={{ listStyle: 'none', padding: 0, lineHeight: '1.8', fontSize: '0.95rem' }}>
                        <li><i className="pi pi-envelope" style={{ color: 'orange'}}></i> support@hotbyte.com</li>
                        <li><i className="pi pi-phone" style={{ color: 'orange' }}></i> (555) 123-4567</li>
                        <li><i className="pi pi-map-marker" style={{ color: 'orange' }}></i>  123 Food Street, City</li>
                    </ul>
                </div>
            </div>

            {/* Social Media Icons */}
            <div style={{
                marginTop: '30px',
                display: 'flex',
                justifyContent: 'center',
                gap: '15px',
                
            }}>
                <Button icon="pi pi-facebook" className="p-button-rounded p-button-text" style={{ color: 'white' }} />
                <Button icon="pi pi-instagram" className="p-button-rounded p-button-text" style={{ color: 'white' }} />
                <Button icon="pi pi-twitter" className="p-button-rounded p-button-text" style={{ color: 'white' }} />
                <Button icon="pi pi-github" className="p-button-rounded p-button-text" style={{ color: 'white' }} />
                <Button icon="pi pi-globe" className="p-button-rounded p-button-text" style={{ color: 'white' }} />
            </div>

            <div style={{ marginTop: '20px', fontSize: '0.85rem', color: '#aaa', textAlign: 'center' }}>
                © 2025 HotByte. All rights reserved.
            </div>
        </footer>
    );
}
