import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: localStorage.getItem('cartItems') 
    ? JSON.parse(localStorage.getItem('cartItems')) 
    : [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  
  reducers: {
    
    addToCart: (state, action) => {
      const item = action.payload; 

const existItem = state.cartItems.find((x) => x._id === item._id);
      if (existItem) {
        existItem.qty += 1;
      } else {
   state.cartItems.push({ ...item, qty: 1 });      }
      
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    
    removeFromCart: (state, action) => {
      const idToRemove = action.payload; 
      
state.cartItems = state.cartItems.filter((x) => x._id !== idToRemove);      
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    },
  
  decreaseCart: (state, action) => {
  const itemIndex = state.cartItems.findIndex((item) => item._id === action.payload._id);
  
  if (state.cartItems[itemIndex].qty > 1) {
    state.cartItems[itemIndex].qty -= 1;
  } else if (state.cartItems[itemIndex].qty === 1) {
    const nextCartItems = state.cartItems.filter(
      (item) => item._id !== action.payload._id
    );
    state.cartItems = nextCartItems;
  }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));

}
  }
});






export const { addToCart, removeFromCart, clearCart ,decreaseCart} = cartSlice.actions;
export default cartSlice.reducer;