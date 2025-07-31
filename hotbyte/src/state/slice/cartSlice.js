import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
    },

    addToCart: (state, action) => {
      const item = action.payload;
      const key = `${item.id}-${item.restaurantId}`;
      const existing = state.cartItems.find(
        x => `${x.id}-${x.restaurantId}` === key
      );

      if (existing) {
        existing.quantity += 1;
        existing.cartIds.push(item.cartId); // add another cartId
      } else {
        state.cartItems.push({ ...item, quantity: 1, cartIds: [item.cartId] });
      }
    },

    increaseQty: (state, action) => {
      const { id, restaurantId } = action.payload;
      const item = state.cartItems.find(
        x => x.id === id && x.restaurantId === restaurantId
      );
      if (item) item.quantity += 1;
    },

    decreaseQty: (state, action) => {
      const { id, restaurantId } = action.payload;
      const item = state.cartItems.find(
        x => x.id === id && x.restaurantId === restaurantId
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else if (item) {
        state.cartItems = state.cartItems.filter(
          x => !(x.id === id && x.restaurantId === restaurantId)
        );
      }
    },

    removeFromCart: (state, action) => {
      const { id, restaurantId } = action.payload;
      state.cartItems = state.cartItems.filter(
        x => !(x.id === id && x.restaurantId === restaurantId)
      );
    },

    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const {
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart,
  setCartItems
} = cartSlice.actions;
export default cartSlice.reducer;
