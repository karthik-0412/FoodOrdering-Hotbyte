import React, { useState, useRef, useEffect } from 'react';
import { Menubar } from 'primereact/menubar';
import { Badge } from 'primereact/badge';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'primereact/menu';
import Buttons from './UI/Buttons';
import './CustomMenubar.css';
import { useSelector } from 'react-redux';
import { matchPath } from 'react-router-dom';

export default function CustomMenubar() {
    const location = useLocation();
    const navigate = useNavigate();
    const menuRef = useRef(null);

    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('role'));
    const [role, setRole] = useState(localStorage.getItem('role'));
    const cartItems = useSelector(state => state.cart.cartItems);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    // dummy cart count

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.clear();
        navigate('/login');
    };

    const itemRenderer = (item) => {
        // const isActive = matchPath({ path: item.path, end: false }, location.pathname);
    //     const isActive =
    // matchPath({ path: item.path, end: true }, location.pathname) ||
    // (item.path !== '/' && matchPath({ path: item.path, end: false }, location.pathname));
const isHome = item.path === '/';
    const isActive = isHome
        ? location.pathname === '/' // Exact match for home
        : matchPath({ path: item.path, end: true }, location.pathname);
    //    const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path + '/'));


        return (
            <Link
                to={item.path || '/'}
                className={`flex align-items-center p-menuitem-link custom-menu-link ${isActive ? 'active-menu-item' : ''} mx-2`}
            >
                <div className="flex items-center gap-x-2">
                    <span className={item.icon} />
                    <span>{item.label}</span>
                </div>
                {item.badge && <Badge className="ml-auto" value={item.badge} />}
                {item.shortcut && (
                    <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">
                        {item.shortcut}
                    </span>
                )}
            </Link>
        );
    };

    // Role-based menu items
    let items = [
        { label: ' Home', icon: 'pi pi-home', path: '/', template: itemRenderer },
        { label: ' Menu', icon: 'pi pi-star', path: '/menu', template: itemRenderer },
        { label: ' About Us', icon: 'pi pi-info-circle', path: '/about', template: itemRenderer },
        { label: ' Contact Us', icon: 'pi pi-envelope', path: '/contact', template: itemRenderer },
    ];

    if (role === 'CUSTOMER') {
        items = [
            { label: ' Home', icon: 'pi pi-home', path: '/', template: itemRenderer },
            { label: ' Menu', icon: 'pi pi-star', path: '/menu', template: itemRenderer },
            { label: ' About Us', icon: 'pi pi-info-circle', path: '/about', template: itemRenderer },
            { label: ' Contact Us', icon: 'pi pi-envelope', path: '/contact', template: itemRenderer },
        ];
    } else if (role === 'RESTAURANT') {
        items = [
            { label: ' Home', icon: 'pi pi-home', path: '/restaurant/dashboard', template: itemRenderer },
            { label: ' Menu', icon: 'pi pi-star', path: '/menu', template: itemRenderer },
            { label: ' About Us', icon: 'pi pi-info-circle', path: '/about', template: itemRenderer },
            { label: ' Contact Us', icon: 'pi pi-envelope', path: '/contact', template: itemRenderer },
        ];

    } else if (role === 'ADMIN') {
        items = [
            { label: ' Home', icon: 'pi pi-home', path: '/admin/dashboard', template: itemRenderer },
            { label: ' Menu', icon: 'pi pi-star', path: '/menu', template: itemRenderer },
            { label: ' About Us', icon: 'pi pi-info-circle', path: '/about', template: itemRenderer },
            { label: ' Contact Us', icon: 'pi pi-envelope', path: '/contact', template: itemRenderer },
        ];
    }

    const start = (
        <div className="flex align-items-center">
            <img alt="logo" src="/hotbytelogo.png" height="40" className="mr-2" style={{ marginTop: '7px' }} />
        </div>
    );

    const handleProfileClick = (event) => {
        menuRef.current.toggle(event);
    };

    // Dropdown menu items for each role
    let profileMenuItems = [];

    if (role === 'CUSTOMER') {
        profileMenuItems = [
            { label: 'Profile Settings', icon: 'pi pi-cog', command: () => navigate('/profile') },
            { label: 'Order History', icon: 'pi pi-history', command: () => navigate('/orders') },
            { separator: true },
            { label: 'Logout', icon: 'pi pi-sign-out', command: handleLogout },
        ];
    } else if (role === 'RESTAURANT') {
        profileMenuItems = [
            { label: 'Profile Settings', icon: 'pi pi-cog', command: () => navigate('/restaurant/profile') },
            { separator: true },
            { label: 'Logout', icon: 'pi pi-sign-out', command: handleLogout },
        ];
    } else if (role === 'ADMIN') {
        profileMenuItems = [
            { label: 'Logout', icon: 'pi pi-sign-out', command: handleLogout },
        ];
    }

    const end = (
        <div className="flex align-items-center gap-4" style={{ marginRight: '5vw' }}>
            {!isLoggedIn && <Buttons />}

            {isLoggedIn && role === 'CUSTOMER' && (
                <>
                    <Link to="/cart" className="text-xl relative">
                        <span className="pi pi-shopping-cart" style={{ fontSize: '1.5rem', color: 'black' }}></span>
                        {cartCount > 0 && (
                            <Badge
                                value={cartCount}
                                severity="danger"
                                className="p-badge"
                                style={{ transform: 'translate(-10%, -80%)' }}
                            />
                        )}
                    </Link>
                    <div className="flex items-center gap-3 cursor-pointer" onClick={handleProfileClick} style={{ marginLeft: '4vw', marginTop: '-3.8vh' }}>
                        <span className="pi pi-user" style={{ fontSize: '1.5rem', color: 'black' }}></span>
                        <span style={{ fontSize: '1.3rem', color: 'black' }}>
                            {role.charAt(0) + role.slice(1).toLowerCase()} User
                        </span>
                        <Menu model={profileMenuItems} popup ref={menuRef} />
                    </div>
                </>
            )}

            {isLoggedIn && (role === 'RESTAURANT' || role === 'ADMIN') && (
                <div className="flex items-center gap-3 cursor-pointer" onClick={handleProfileClick}>
                    <span className="pi pi-user" style={{ fontSize: '1.5rem', color: 'black', marginRight: '10px' }}></span>
                    <span style={{ fontSize: '1.3rem', color: 'black' }}>
                        {role.charAt(0) + role.slice(1).toLowerCase()} User
                    </span>
                    <Menu model={profileMenuItems} popup ref={menuRef} />
                </div>
            )}
        </div>
    );

    return (
        <div className="card">
            <Menubar
                model={items}
                start={start}
                end={end}
                className="flex flex-wrap justify-content-between"
                style={{ border: 'none', borderRadius: 0, padding: '0 10px' }}
            />
        </div>
    );
}
