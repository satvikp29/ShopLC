import { createSlice } from '@reduxjs/toolkit';
import { calculateCartTotals } from '../../utils/helpers';

const getCartFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('cart')) || [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  localStorage.setItem('cart', JSON.stringify(items));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: getCartFromStorage(),
    totals: calculateCartTotals(getCartFromStorage()),
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find((item) => item._id === product._id);

      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, product.stock);
      } else {
        state.items.push({ ...product, quantity });
      }

      state.totals = calculateCartTotals(state.items);
      saveCart(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      state.totals = calculateCartTotals(state.items);
      saveCart(state.items);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i._id === id);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i._id !== id);
        } else {
          item.quantity = Math.min(quantity, item.stock);
        }
      }
      state.totals = calculateCartTotals(state.items);
      saveCart(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      state.totals = calculateCartTotals([]);
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
