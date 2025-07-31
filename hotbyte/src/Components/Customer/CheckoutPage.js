import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Checkbox } from "primereact/checkbox";
import CustomMenubar from "../CustomMenubar";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../state/slice/cartSlice";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer";
import { useLocation } from 'react-router-dom';


export default function CheckoutPage() {
  const [useSavedAddress, setUseSavedAddress] = useState(true);
  const [savedAddress, setSavedAddress] = useState(null);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [useCustomerAddress, setUseCustomerAddress] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [upiId, setUpiId] = useState("");
  const dispatch = useDispatch();
  const nav = useNavigate();
  const cartItems = useSelector(state => state.cart.cartItems);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const location = useLocation();
  const subtotal = calculateSubtotal();
  const tax = calculateTax();
  const deliveryFee = calculateDeliveryFee();
  const total = calculateTotal();
  const discount = calculateDiscount();



  useEffect(() => {
    const fetchCustomerProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get("http://localhost:9002/api/customer/get", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const customer = response.data;
        if (customer.address) {
          setSavedAddress(customer.address);
          setAddress(customer.address); // auto-fill form
        }

      } catch (err) {
        console.error("Failed to fetch customer data", err);
      }
    };

    fetchCustomerProfile();
  }, []);
  useEffect(() => {
  if (location.state?.appliedCoupon) {
    setAppliedCoupon(location.state.appliedCoupon);
  }
}, [location.state]);





  const paymentMethodMap = {
    "Credit Card": "CREDIT_CARD",
    "Debit Card": "DEBIT_CARD",
    "Cash on Delivery": "CASH_ON_DELIVERY",
    "UPI Payment": "UPI",
    "PayPal": "PAYPAL"
  };

  
  // const { subtotal, discount, tax, deliveryFee, total, appliedCoupon, cartItems } = location.state || {};
  



  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first.");
      return;
    }

    if ((paymentMethod === "Credit Card" || paymentMethod === "Debit Card") &&
      (!cardNumber || !expiry || !cvv)) {
      alert("Please fill in card details");
      return;
    }

    if (paymentMethod === "UPI Payment" && !upiId) {
      alert("Please enter your UPI ID");
      return;
    }


    if (cartItems.length === 0) {
      alert("Please add items to cart.");
      return;
    }

    const restaurantId = cartItems[0].restaurantId;
    const addressToUse = useSavedAddress ? savedAddress : address;

    if (!addressToUse?.street || !addressToUse?.city || !addressToUse?.state || !addressToUse?.pincode) {
      alert("Please provide a valid delivery address.");
      return;
    }

    //     const orderCreateDTO = {
    //   specialInstructions,
    //   totalPrice: calculateTotal(),
    //   paymentMethod: paymentMethodMap[paymentMethod],
    //   address: addressToUse,
    //   // items: cartItems.map(item => ({
    //   //   cartId: item.cartId,
    //   //   menu: item.menu,  // optional depending on your CartDTO structure
    //   //   quantity: item.quantity,
    //   //   total: item.price * item.quantity
    //   // }))
    // //   items: cartItems.map(item => ({
    // //   cartId: item.cartId
    // // }))
    // cartIds: cartItems.map(item => item.cartId)

    // };
    // const orderCreateDTO = {
    //   specialInstructions,
    //   subtotal,
    //   tax,
    //   discount,
    //   total,
    //   deliveryFee,
    //   paymentMethod: paymentMethodMap[paymentMethod],
    //   address: addressToUse,
    //   couponCode: appliedCoupon?.code || null,
    //   cartIds: cartItems.map(item => ({ cartId: item.cartId }))
    //   // items: cartItems.map(item => ({
    //   //   cartId: item.cartId,
    //   //   quantity: item.quantity,
    //   //   price: item.price,
    //   //   menuId: item.menuId || item.menu?.menuId || item.id  // support both structures
    //   // }))
    // };
    console.log("Cart Items before placing order:", cartItems);
console.log("Cart IDs sent to backend:", cartItems.map(item => item.cartId));

    const orderCreateDTO = {
      specialInstructions,
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      discount: calculateDiscount(), // ✅ fixed
      total: calculateTotal(),
      deliveryFee: calculateDeliveryFee(),
      paymentMethod: paymentMethodMap[paymentMethod],
      address: addressToUse,
      couponCode: appliedCoupon?.code || null,
      // cartIds: cartItems.map(item => ({ cartId: item.cartId }))
      // cartIds: cartItems.map(item => item.cartId)
      items: cartItems.map(item => ({ cartId: item.cartId }))

      
    };


    console.log(orderCreateDTO);


    try {
      const response = await axios.post(`http://localhost:9002/api/order/placeorder/${restaurantId}`, orderCreateDTO, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert("Order placed successfully! Order ID: " + response.data.orderId);
      dispatch(clearCart());
      nav("/orders");
    } catch (err) {
      console.error("Order placement failed", err);
      const msg = err.response?.data?.message || "Network/server error";
      alert("Order failed: " + msg);
    }
  };
  // const calculateSubtotal = () => {
  //   return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  // };

  // const calculateTax = () => {
  //   return calculateSubtotal() * 0.18;
  // };
  // const calculateDeliveryFee = () => {
  //   return cartItems.length > 0 ? 59 : 0;
  // };
  //   const calculateTotal = () => {
  //     const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  //     const tax = subtotal * 0.18;
  //     const delivery = cartItems.length > 0 ? 59 : 0;
  //     return subtotal + tax + delivery;
  //   };
  function calculateSubtotal() {
    return cartItems.reduce((acc, item) => acc + (item.menu?.price || item.price || 0) * item.quantity, 0);
  }

  function calculateTax() {
    const taxRate = 0.05; // 5%
    return calculateSubtotal() * taxRate;
  }

  function calculateDeliveryFee() {
    return calculateSubtotal() > 1500 ? 20 : 50;
  }

  function calculateDiscount() {
    if (!appliedCoupon || !appliedCoupon.discount) return 0;
    return (calculateSubtotal() * appliedCoupon.discount) / 100;
  }

  function calculateTotal() {
    return (
      calculateSubtotal() +
      calculateTax() +
      calculateDeliveryFee() -
      calculateDiscount()
    );
  }

  const labelStyle = {
    fontWeight: "bold",
    marginBottom: "0.25rem",
    display: "block",
    fontSize: "0.85rem"
  };

  return (
    <>
      {!useCustomerAddress && (
        <>
          <label style={labelStyle}>Street Address</label>
          <InputText
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            placeholder="123 Main St"
            style={{ width: "100%", padding: "0.75rem", marginBottom: "1rem" }}
          />
          {/* City, State, Pincode fields as you already have */}
        </>
      )}

      <CustomMenubar />
      <div style={{ display: "flex", justifyContent: "space-between", padding: "2rem" }}>
        <div style={{ width: "65%" }}>
          <h1>Checkout</h1>

          {/* Use Saved Address Checkbox */}
          <div style={{ marginBottom: "1rem" }}>
            <Checkbox
              inputId="useSavedAddress"
              checked={useSavedAddress}
              onChange={(e) => {
                setUseSavedAddress(e.checked);
                if (e.checked && savedAddress) {
                  setAddress(savedAddress);
                }
              }}
            />
            <label htmlFor="useSavedAddress" style={{ marginLeft: "0.5rem" }}>
              Use saved address
            </label>
          </div>

          {/* Address Fields */}
          <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem", marginBottom: "1.5rem" }}>
            <h3>Delivery Address</h3>
            <label style={labelStyle}>Street Address</label>
            <InputText
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              placeholder="123 Main St"
              style={{ width: "100%", padding: "0.75rem", marginBottom: "1rem" }}
              disabled={useSavedAddress}
            />
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>City</label>
                <InputText
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  disabled={useSavedAddress}
                  placeholder="City"
                  style={{ width: "100%", padding: "0.75rem" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>State</label>
                <InputText
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  disabled={useSavedAddress}
                  placeholder="State"
                  style={{ width: "100%", padding: "0.75rem" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Pincode</label>
                <InputText
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  disabled={useSavedAddress}
                  placeholder="123456"
                  style={{ width: "100%", padding: "0.75rem" }}
                />
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem", marginBottom: "1.5rem" }}>
            <h3>Payment Method</h3>
            <Dropdown
              value={paymentMethod}
              options={[
                { label: "Credit Card", value: "Credit Card" },
                { label: "Debit Card", value: "Debit Card" },
                { label: "Cash on Delivery", value: "Cash on Delivery" },
                { label: "UPI Payment", value: "UPI Payment" },
                { label: "PayPal", value: "PayPal" }
              ]}
              onChange={(e) => setPaymentMethod(e.value)}
              placeholder="Select Payment Method"
              style={{ width: "100%", marginBottom: "1rem" }}
            />
            {(paymentMethod === "Credit Card" || paymentMethod === "Debit Card") && (
              <>
                <label style={labelStyle}>Card Number</label>
                <InputText value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="1234 5678 9012 3456" style={{ width: "100%", marginBottom: "1rem" }} />
                <div style={{ display: "flex", gap: "1rem" }}>
                  <InputText value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" style={{ flex: 1 }} />
                  <InputText value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="CVV" style={{ flex: 1 }} />
                </div>
              </>
            )}
            {paymentMethod === "UPI Payment" && (
              <>
                <label style={labelStyle}>UPI ID</label>
                <InputText value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="you@upi" style={{ width: "100%", marginBottom: "1rem" }} />
              </>
            )}
            {paymentMethod === "PayPal" && (
              <Button label="Pay with PayPal" style={{ backgroundColor: "#003087", color: "#fff", width: "100%" }} />
            )}
          </div>

          {/* Special Instructions */}
          <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem" }}>
            <h3>Special Instructions</h3>
            <InputTextarea value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)} rows={3} style={{ width: "100%" }} placeholder="Any special instructions..." />
          </div>
        </div>

        {/* Right: Order Summary */}
        {/* <div style={{ width: "30%", border: "1px solid #ddd", borderRadius: "8px", padding: "1rem", height: "fit-content" }}>
          <h3>Order Summary</h3>
          {cartItems.map((item) => (
            <div key={item.id} style={{ marginBottom: "0.5rem" }}>
              <strong>{item.name || item.itemName}</strong>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                <span>Qty: {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))}
          <hr />
          <div style={{ fontSize: "0.9rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Subtotal</span>
              <span>₹{cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Delivery Fee</span>
              <span>₹59.00</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Tax</span>
              <span>₹{(cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) * 0.18).toFixed(2)}</span>
            </div>
          </div>
          <hr />
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
            <span>Total</span>
            <span style={{ color: "#f57c00" }}>₹{calculateTotal().toFixed(2)}</span>
          </div>
          <Button label="Place Order" style={{ backgroundColor: "#f57c00", border: "none", width: "100%", marginTop: "1rem" }} onClick={handlePlaceOrder} />
        </div> */}
        <div style={{ width: "30%", border: "1px solid #ddd", borderRadius: "8px", padding: "1rem", height: "fit-content" }}>
  <h3>Order Summary</h3>

  {cartItems.map((item) => (
    <div key={item.id} style={{ marginBottom: "0.5rem" }}>
      <strong>{item.name || item.itemName}</strong>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
        <span>Qty: {item.quantity}</span>
        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
      </div>
    </div>
  ))}

  <hr />

  <div style={{ fontSize: "0.9rem" }}>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span>Subtotal</span>
      <span>₹{subtotal.toFixed(2)}</span>
    </div>

    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span>Delivery Fee</span>
      <span>₹{deliveryFee.toFixed(2)}</span>
    </div>

    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span>Tax</span>
      <span>₹{tax.toFixed(2)}</span>
    </div>

    {appliedCoupon && (
      <div style={{ display: "flex", justifyContent: "space-between", color: "green" }}>
        <span>Discount ({appliedCoupon.code})</span>
        <span>- ₹{discount.toFixed(2)}</span>
      </div>
    )}
  </div>

  <hr />

  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
    <span>Total</span>
    <span style={{ color: "#f57c00" }}>₹{total.toFixed(2)}</span>
  </div>

  <Button
    label="Place Order"
    style={{ backgroundColor: "#f57c00", border: "none", width: "100%", marginTop: "1rem" }}
    onClick={handlePlaceOrder}
  />
</div>

      </div>
      <Footer />
    </>
  );
}
