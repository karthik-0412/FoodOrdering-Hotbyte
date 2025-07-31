
import React, { useState, useRef } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Ripple } from 'primereact/ripple';
import { StyleClass } from 'primereact/styleclass';

export default function SideBarUser() {
    const [visible, setVisible] = useState(false);
    const btnRef1 = useRef(null);
    const btnRef2 = useRef(null);
    const btnRef3 = useRef(null);
    const btnRef4 = useRef(null);

    return (
        <div className="card flex justify-content-center">
           
           <h1>hello</h1>
           <h1></h1>
            {/* <Sidebar
                content={({ closeIconRef, hide }) => (
                           <h1>hello world</h1>    )}
            ></Sidebar> */}
        </div>
    )
}
        