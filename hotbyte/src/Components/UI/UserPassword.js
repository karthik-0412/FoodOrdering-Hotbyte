import React, { useState } from "react";
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';

export default function UserPassword() {
    const [value, setValue] = useState('');
    

    const header = (
        <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>
            Pick a password
        </div>
    );

    const footer = (
        <>
            <Divider />
            <p style={{ marginTop: '8px' }}>Suggestions</p>
            <ul style={{ paddingLeft: '20px', marginTop: '0', lineHeight: '1.5' }}>
                <li>At least one lowercase</li>
                <li>At least one uppercase</li>
                <li>At least one numeric</li>
                <li>At least one special character</li>
                <li>Minimum 8 characters</li>
                
            </ul>
        </>
    );

    return (
        <div style={{ display: 'flex', alignItems: 'center',width: '100%' }}>
            <i className="pi pi-lock" style={{ fontSize: '1rem', color: '#6c757d', marginRight: '8px' }} />
            <Password
                value={value}
                onChange={(e) => setValue(e.target.value)}
                header={header}
                footer={footer}
                placeholder="Enter your Password"
                toggleMask
                // style={{ width: '100%' }}
                inputStyle={{ width: '100%', padding: '10px', paddingRight: '123px' }}
            />
        </div>
    )
}
