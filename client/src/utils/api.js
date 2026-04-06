import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  logout: () => API.post('/auth/logout'),
  getMe: () => API.get('/auth/me'),
  forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => API.put(`/auth/reset-password/${token}`, { password }),
};

export const productAPI = {
  getProducts: (params) => API.get('/products', { params }),
  getProduct: (id) => API.get(`/products/${id}`),
  getFeatured: () => API.get('/products/featured'),
  getCategories: () => API.get('/products/categories'),
  createProduct: (data) => API.post('/products', data),
  updateProduct: (id, data) => API.put(`/products/${id}`, data),
  deleteProduct: (id) => API.delete(`/products/${id}`),
  addReview: (id, data) => API.post(`/products/${id}/reviews`, data),
};

export const orderAPI = {
  createOrder: (data) => API.post('/orders', data),
  getOrder: (id) => API.get(`/orders/${id}`),
  getMyOrders: () => API.get('/orders/myorders'),
  payOrder: (id, data) => API.put(`/orders/${id}/pay`, data),
  cancelOrder: (id, reason) => API.put(`/orders/${id}/cancel`, { reason }),
  getAllOrders: (params) => API.get('/orders', { params }),
  updateOrderStatus: (id, data) => API.put(`/orders/${id}/status`, data),
};

export const paymentAPI = {
  createStripeIntent: (data) => API.post('/payments/stripe/create-intent', data),
  createRazorpayOrder: (data) => API.post('/payments/razorpay/create-order', data),
  verifyRazorpayPayment: (data) => API.post('/payments/razorpay/verify', data),
};

export const userAPI = {
  getProfile: () => API.get('/users/profile'),
  updateProfile: (data) => API.put('/users/profile', data),
  addAddress: (data) => API.post('/users/addresses', data),
  updateAddress: (id, data) => API.put(`/users/addresses/${id}`, data),
  deleteAddress: (id) => API.delete(`/users/addresses/${id}`),
  getWishlist: () => API.get('/users/wishlist'),
  toggleWishlist: (productId) => API.put(`/users/wishlist/${productId}`),
  getAllUsers: (params) => API.get('/users', { params }),
  updateUser: (id, data) => API.put(`/users/${id}`, data),
};

export default API;
