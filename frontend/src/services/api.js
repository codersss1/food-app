import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/api/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  signup: (data) => apiClient.post('/auth/signup', data),
  login: (data) => apiClient.post('/auth/login', data),
  verifyEmail: (data) => apiClient.post('/auth/verify-email', data),
  verifyStudent: (data) => apiClient.post('/auth/verify-student', data),
  forgotPassword: (data) => apiClient.post('/auth/forgot-password', data),
  resetPassword: (data) => apiClient.post('/auth/reset-password', data),
  logout: () => apiClient.post('/auth/logout'),
};

// User endpoints
export const userAPI = {
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data) => apiClient.put('/users/profile', data),
  deleteAccount: (data) => apiClient.delete('/users/account', { data }),
  getOrderHistory: (params) => apiClient.get('/users/orders', { params }),
  getOrderDetails: (orderId) => apiClient.get(`/users/orders/${orderId}`),
  canReview: (orderId) => apiClient.get(`/users/orders/${orderId}/can-review`),
};

// Restaurant endpoints
export const restaurantAPI = {
  getAll: (params) => apiClient.get('/restaurants', { params }),
  getById: (id) => apiClient.get(`/restaurants/${id}`),
  search: (params) => apiClient.get('/restaurants/search', { params }),
  getMenu: (restaurantId) => apiClient.get(`/restaurants/${restaurantId}/menu`),
  getTopRated: (params) => apiClient.get('/restaurants/featured/top-rated', { params }),
  getFastestDelivery: (params) => apiClient.get('/restaurants/featured/fastest-delivery', { params }),
};

// Menu endpoints
export const menuAPI = {
  searchItems: (params) => apiClient.get('/menu/search', { params }),
  getCategories: (restaurantId) => apiClient.get(`/menu/categories/${restaurantId}`),
  getByCategory: (restaurantId, categoryId) => 
    apiClient.get(`/menu/category/${restaurantId}/${categoryId}`),
  getVegetarian: (params) => apiClient.get('/menu/vegetarian', { params }),
  getVegan: (params) => apiClient.get('/menu/vegan', { params }),
};

// Order endpoints
export const orderAPI = {
  create: (data) => apiClient.post('/orders', data),
  getById: (orderId) => apiClient.get(`/orders/${orderId}`),
  updateStatus: (orderId, data) => apiClient.put(`/orders/${orderId}`, data),
  cancel: (orderId) => apiClient.delete(`/orders/${orderId}/cancel`),
  track: (orderId) => apiClient.get(`/orders/${orderId}/track`),
  validatePromo: (data) => apiClient.post('/orders/validate-promo', data),
};

// Payment endpoints
export const paymentAPI = {
  createRazorpayOrder: (data) => apiClient.post('/payments/create-order', data),
  verify: (data) => apiClient.post('/payments/verify', data),
  getStatus: (orderId) => apiClient.get(`/payments/${orderId}/status`),
  refund: (orderId) => apiClient.post(`/payments/${orderId}/refund`),
};

// Review endpoints
export const reviewAPI = {
  create: (data) => apiClient.post('/reviews', data),
  getRestaurantReviews: (restaurantId, params) => 
    apiClient.get(`/reviews/restaurant/${restaurantId}`, { params }),
  getUserReviews: (params) => apiClient.get('/reviews/user/my-reviews', { params }),
  update: (reviewId, data) => apiClient.put(`/reviews/${reviewId}`, data),
  delete: (reviewId) => apiClient.delete(`/reviews/${reviewId}`),
};

export default apiClient;
