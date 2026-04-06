import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderAPI } from '../../utils/api';

export const createOrder = createAsyncThunk('orders/create', async (data, { rejectWithValue }) => {
  try {
    const res = await orderAPI.createOrder(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create order');
  }
});

export const fetchOrder = createAsyncThunk('orders/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await orderAPI.getOrder(id);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch order');
  }
});

export const fetchMyOrders = createAsyncThunk('orders/fetchMine', async (_, { rejectWithValue }) => {
  try {
    const res = await orderAPI.getMyOrders();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
  }
});

export const fetchAllOrders = createAsyncThunk('orders/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await orderAPI.getAllOrders(params);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const payOrder = createAsyncThunk('orders/pay', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await orderAPI.payOrder(id, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Payment failed');
  }
});

export const cancelOrder = createAsyncThunk('orders/cancel', async ({ id, reason }, { rejectWithValue }) => {
  try {
    const res = await orderAPI.cancelOrder(id, reason);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to cancel order');
  }
});

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await orderAPI.updateOrderStatus(id, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    success: false,
    total: 0,
    pages: 1,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    clearSuccess: (state) => { state.success = false; },
    clearCurrentOrder: (state) => { state.currentOrder = null; },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; state.success = false; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(createOrder.pending, pending)
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentOrder = action.payload.order;
      })
      .addCase(createOrder.rejected, rejected)
      .addCase(fetchOrder.pending, pending)
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.order;
      })
      .addCase(fetchOrder.rejected, rejected)
      .addCase(fetchMyOrders.pending, pending)
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
      })
      .addCase(fetchMyOrders.rejected, rejected)
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload.order;
        state.success = true;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload.order;
        state.success = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.currentOrder = action.payload.order;
        const idx = state.orders.findIndex((o) => o._id === action.payload.order._id);
        if (idx !== -1) state.orders[idx] = action.payload.order;
      });
  },
});

export const { clearError, clearSuccess, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
