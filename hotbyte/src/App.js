import React, { useEffect } from 'react';
import CustomMenubar from './Components/CustomMenubar';
import Footer from './Components/Footer';
import Rounting from './Routing';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCartItems } from './state/slice/cartSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadCart = async () => {
      const customerId = localStorage.getItem("customerId");
      if (!customerId) return;

      try {
        const response = await axios.get(`http://localhost:9002/api/cart/view/${customerId}`);
        const cartData = response.data.map(cart => ({
          cartId: cart.cartId, // Required for update/remove
          id: cart.menu?.menuId,
          name: cart.menu?.itemName,
          price: cart.menu?.price,
          image: cart.menu?.imageUrl,
          quantity: cart.quantity,
          restaurant: cart.menu?.restaurant?.restaurantName
        }));
        dispatch(setCartItems(cartData));
      } catch (err) {
        console.error("Failed to load cart globally", err);
      }
    };

    loadCart();
  }, []);

  return (
    <div className="App">
      {/* <CustomMenubar /> ✅ Show cart count here */}
      <Rounting />
      {/* <Footer /> */}
    </div>
  );
}

export default App;
