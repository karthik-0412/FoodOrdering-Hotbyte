// ... (imports unchanged)
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { addToCart, clearCart, increaseQty, decreaseQty, removeFromCart, setCartItems } from '../../state/slice/cartSlice';
import { Divider } from 'primereact/divider';
import { Dialog } from 'primereact/dialog';
import { useState } from 'react';
import './CartComponent.css';
import { useNavigate } from 'react-router-dom';
import CustomMenubar from '../CustomMenubar';
import axios from 'axios';
import Footer from '../Footer';

export default function CartComponent() {
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.cartItems);

    const [couponDialogVisible, setCouponDialogVisible] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);
    const deliveryFee = cartItems.length > 0 ? 59 : 0;
    const tax = subtotal * 0.18;
    let discount = 0;

    if (appliedCoupon) {
        let calculated = subtotal * (appliedCoupon.discount / 100);
        discount = appliedCoupon.maxDiscount ? Math.min(calculated, appliedCoupon.maxDiscount) : calculated;
    }

    const total = subtotal - discount + deliveryFee + tax;
    const nav = useNavigate();
    const [coupons, setCoupons] = useState([]);

useEffect(() => {
    const fetchCoupons = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:9002/api/coupons/all", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCoupons(res.data);
            console.log("Fetched coupons:", res.data);
        } catch (err) {
            console.error("Failed to fetch coupons:", err);
        }
    };

    fetchCoupons();
}, []);

    // const coupons = [
    //     { name: 'Welcome Offer', code: 'WELCOME20', desc: '20% off on your first order', minOrder: 25, expiry: '12/31/2024', used: '5/10', status: 'Active',discount: 20,maxDiscount: 100   },
    //     { name: 'Flat $5 Off', code: 'SAVE5', desc: '$5 off on orders above $30', minOrder: 30, expiry: '12/31/2024', used: '2/5', status: 'Expired' },
    //     { name: 'Weekend Special', code: 'WEEKEND15', desc: '15% off on weekend orders', minOrder: 20, expiry: '12/31/2024', used: '3/10', status: 'Expired' },
    //     { name: 'Big Order Discount', code: 'BIGORDER', desc: '$10 off on orders above $50', minOrder: 50, expiry: '12/31/2024', used: '1/3', status: 'Expired' }
    // ];

    useEffect(() => {
    const fetchCart = async () => {
        try {
            const customerId = localStorage.getItem("customerId");
            const token = localStorage.getItem("token");
            console.log(token)
            const response = await axios.get(`http://localhost:9002/api/cart/view/${customerId}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const mergedMap = new Map();

            response.data.forEach(cart => {
                const menuId = cart.menu?.menuId;
                const restaurantId = cart.menu?.restaurant?.restaurantId;
                const key = `${menuId}-${restaurantId}`;

                if (!mergedMap.has(key)) {
                    mergedMap.set(key, {
                        cartIds: [cart.cartId],
                        cartId: cart.cartId, // keep first one
                        id: menuId,
                        name: cart.menu?.itemName,
                        price: cart.menu?.price,
                        image: cart.menu?.imageUrl,
                        quantity: cart.quantity,
                        restaurant: cart.menu?.restaurant?.restaurantName,
                        restaurantId: restaurantId,
                    });
                } else {
                    const existing = mergedMap.get(key);
                    existing.quantity += cart.quantity;
                    existing.cartIds.push(cart.cartId);
                }
            });

            dispatch(setCartItems(Array.from(mergedMap.values())));
        } catch (err) {
            console.error("Failed to fetch cart:", err);
        }
    };

    fetchCart();
}, []);



    const handleApplyCoupon = async () => {
        try {
            const token = localStorage.getItem("token");
            console.log(token)
            const res = await axios.get(`http://localhost:9002/api/coupons/code/${couponCode}`,
                {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            );
            const coupon = res.data;
            if (coupon.status !== 'EXPIRED' && subtotal >= coupon.minOrder) {
                setAppliedCoupon(coupon);
            } else {
                alert('Coupon is either expired or does not meet minimum order requirement.');
            }
        } catch (err) {
            alert("Invalid coupon code");
            console.error("Coupon error", err);
        }
    };

    const handleClick = () => {
    nav("/checkout", {
        state: {
            subtotal,
            discount,
            tax,
            deliveryFee,
            total,
            appliedCoupon,
            cartItems
        }
    });
};

    const handleGoToMenu = () => nav("/menu");

    const handleRemove = async (item) => {
        try {
            const token = localStorage.getItem("token");
            console.log(token)
        await Promise.all(item.cartIds.map(cartId =>
            axios.delete(`http://localhost:9002/api/cart/remove/${cartId}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        ));
        dispatch(removeFromCart(item));
    } catch (error) {
        console.error("Failed to remove item from cart:", error);
    }
    };

    const handleIncrease = async (item) => {
        try {
            const token = localStorage.getItem("token");
            console.log(token)
        const cartId = item.cartIds[0]; // just update one of them
        await axios.put(`http://localhost:9002/api/cart/update/${cartId}`, {
            menu: { menuId: item.id },
            quantity: item.quantity + 1
        },{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        dispatch(increaseQty(item));
    } catch (err) {
        console.error("Failed to update quantity", err);
    }
    };

    const handleDecrease = async (item) => {
        if (item.quantity <= 1) return;
    try {
        const token = localStorage.getItem("token");
            console.log(token)
        const cartId = item.cartIds[0]; // just update one
        await axios.put(`http://localhost:9002/api/cart/update/${cartId}`, {
            menu: { menuId: item.id },
            quantity: item.quantity - 1
        },{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        dispatch(decreaseQty(item));
    } catch (err) {
        console.error("Failed to decrease quantity", err);
    }
    };

    const handleClearCart = async () => {
        try {
            const token = localStorage.getItem("token");
            console.log(token)
            const customerId = localStorage.getItem("customerId");
            await axios.delete(`http://localhost:9002/api/cart/clear/${customerId}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            dispatch(clearCart());
        } catch (error) {
            console.error("Failed to clear cart:", error);
        }
    };

    useEffect(() => {
        if (appliedCoupon && subtotal < appliedCoupon.minOrder) {
            alert(`Coupon "${appliedCoupon.code}" removed: minimum order ₹${appliedCoupon.minOrder} not met.`);
            setAppliedCoupon(null);
            setCouponCode('');
        }
    }, [subtotal, appliedCoupon]);

    return (
        <>
            <CustomMenubar />
            <div style={{ padding: '2rem' ,minHeight:'80vh'}}>
                {cartItems.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: '5rem' }}>
                        <i className="pi pi-shopping-bag" style={{ fontSize: '4rem', color: '#999' }}></i>
                        <h2>Your cart is empty</h2>
                        <p>Add some delicious items to your cart to get started!</p>
                        <Button label="Browse Menu" icon="pi pi-arrow-right" onClick={handleGoToMenu} style={{ backgroundColor: 'orange', border: 'none' }} />
                    </div>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem' }}>
                        {/* Left: Cart Items */}
                        <div style={{ flex: '1 1 65%' }}>
                            <h2>Shopping Cart</h2>
                            <div style={{ textAlign: 'right', marginBottom: '15px' }}>
                                <Button
                                    label="Clear Cart"
                                    icon="pi pi-trash"
                                    className="p-button-warning"
                                    onClick={handleClearCart}
                                />
                            </div>
                            {cartItems.map((item, index) => (
                                <div
                                    key={`${item.id}-${item.restaurant}-${index}`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginBottom: '1rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        padding: '1rem',
                                        flexWrap: 'wrap'
                                    }}
                                >
                                    <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', borderRadius: '8px', marginRight: '1rem' }} />
                                    <div style={{ flex: '1 1 150px' }}>
                                        <h3 style={{ margin: 0 }}>{item.name}</h3>
                                        <p style={{ margin: 0, color: 'gray' }}>{item.restaurant}</p>
                                        <p style={{ margin: '0.5rem 0', fontWeight: 'bold' }}>₹{(item.price || 0).toFixed(2)}</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Button icon="pi pi-minus" onClick={() => handleDecrease(item)} style={{ backgroundColor: 'lightgray' }} />
                                        <InputNumber value={item.quantity} readOnly inputStyle={{ width: '40px', border: 'none', textAlign: 'center' }} style={{ margin: '0 10px' }} />
                                        <Button icon="pi pi-plus" onClick={() => handleIncrease(item)} style={{ backgroundColor: 'lightgray' }} />
                                    </div>
                                    <Button icon="pi pi-trash" className="p-button-danger" onClick={() => handleRemove(item)} style={{ marginLeft: '1rem', backgroundColor: 'red', color: 'white' }} />
                                </div>
                            ))}
                        </div>

                        {/* Right: Order Summary */}
                        <div style={{
                            width: "30%",
                            position: "sticky",
                            top: "90px",
                            alignSelf: "flex-start",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "1rem",
                            backgroundColor: "#fff",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
                        }}>
                            <h3 style={{ marginBottom: "1rem" }}>Order Summary</h3>
                            <Button
                                label="Apply Coupon"
                                className="p-button-outlined"
                                style={{ width: "100%", marginBottom: "1rem" }}
                                onClick={() => setCouponDialogVisible(true)}
                            />
                            {appliedCoupon && (
                                <div style={{ color: "green", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                                    <i className="pi pi-check-circle" style={{ marginRight: "0.5rem" }}></i>
                                    Coupon "{appliedCoupon.code}" applied! You saved ₹{discount.toFixed(2)}
                                </div>
                            )}

                            <div style={{ fontSize: "0.9rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", margin: "0.5rem 0" }}>
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>
                                {appliedCoupon && (
                                    <div style={{ display: "flex", justifyContent: "space-between", margin: "0.5rem 0" }}>
                                        <span>Discount</span>
                                        <span style={{ color: "green" }}>-₹{discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div style={{ display: "flex", justifyContent: "space-between", margin: "0.5rem 0" }}>
                                    <span>Delivery Fee</span>
                                    <span>₹{deliveryFee.toFixed(2)}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", margin: "0.5rem 0" }}>
                                    <span>Tax</span>
                                    <span>₹{tax.toFixed(2)}</span>
                                </div>
                            </div>
                            <Divider />
                            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "1rem" }}>
                                <span>Total</span>
                                <span style={{ color: "#f57c00" }}>₹{total.toFixed(2)}</span>
                            </div>
                            <div style={{ fontSize: "0.85rem", color: "#888", marginBottom: "1rem" }}>
                                <i className="pi pi-clock" style={{ marginRight: "0.5rem" }}></i>
                                Estimated delivery: 25-35 minutes
                            </div>
                            <Button
                                label="Proceed to Checkout"
                                style={{ backgroundColor: "#f57c00", border: "none", width: "100%", padding: "0.75rem" }}
                                onClick={handleClick}
                            />
                        </div>
                    </div>
                )}
                <Dialog
    header="Available Coupons"
    visible={couponDialogVisible}
    onHide={() => setCouponDialogVisible(false)}
    style={{ width: '40vw' }}
    modal
>
    <div>
        <p><strong>Have a coupon code?</strong></p>
        <div style={{ display: 'flex', marginBottom: '1rem' }}>
            <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                style={{ flex: 1, marginRight: '0.5rem', padding: '0.5rem' }}
            />
            <Button label="Apply" style={{ backgroundColor: 'orange', border: 'none' }} onClick={handleApplyCoupon} />
        </div>

        <h4>Available Offers</h4>

        {coupons.map((c, index) => {
            const isActive = c.status === 'ACTIVE'; 
            const isApplied = appliedCoupon?.code === c.code;

            return (
                <div
                    key={index}
                    style={{
                        border: `1px solid ${isApplied ? 'orange' : '#ddd'}`,
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        backgroundColor: isApplied ? '#fff8e1' : '#fff',
                        cursor: isActive ? 'pointer' : 'not-allowed',
                        opacity: isActive ? 1 : 0.6
                    }}
                    onClick={() => {
                        if (!isActive) return;

                        if (subtotal >= c.minOrder) {
                            setCouponCode(c.code);           // Set input field
                            setAppliedCoupon(c);             // Apply
                            setCouponDialogVisible(false);   // Close dialog
                        } else {
                            alert(`Minimum order ₹${c.minOrder} required.`);
                        }
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <strong>{c.name}</strong> ({c.code})
                            <p style={{ margin: 0 }}>{c.desc}</p>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'gray' }}>
                                Min order: ₹{c.minOrder} | Expires: {c.expiry} | Used: {c.usageCount}/{c.usageLimit}
                            </p>
                            <p style={{ color: isActive ? 'green' : 'red', margin: '0.2rem 0' }}>
                                {isActive ? 'Active' : 'Expired'}
                            </p>
                        </div>
                        <Button
                            label={isApplied ? 'Applied' : 'Apply'}
                            disabled={!isActive || isApplied}
                            style={{
                                backgroundColor: isApplied ? 'orange' : isActive ? '#f0ad4e' : '#eee',
                                border: 'none',
                                color: isApplied ? '#fff' : isActive ? '#fff' : '#aaa'
                            }}
                        />
                    </div>
                </div>
            );
        })}

        <Divider />
        <div style={{ fontSize: '0.8rem', color: 'gray' }}>
            <p>• Coupons cannot be combined with other offers</p>
            <p>• Discount applies to food total only, not delivery fees or taxes</p>
            <p>• Coupons are valid for limited time and usage</p>
            <p>• Management reserves the right to modify or cancel offers</p>
        </div>
    </div>
</Dialog>

            </div>
            <Footer/>
        </>
    );
}
