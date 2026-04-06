const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper to get auth token from localStorage
const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

// Helper to make API requests with auth
async function apiCall(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

// Auth APIs
export const authAPI = {
  signup: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
  }) => apiCall('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  login: (email: string, password: string) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  verifyEmail: (token: string) =>
    apiCall('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

  resendOTP: (email: string) =>
    apiCall('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// User APIs
export const userAPI = {
  getProfile: () => apiCall('/users/profile'),

  updateProfile: (data: {
    name?: string;
    phone?: string;
    avatar?: string;
  }) => apiCall('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  updatePassword: (oldPassword: string, newPassword: string) =>
    apiCall('/users/password', {
      method: 'PUT',
      body: JSON.stringify({ oldPassword, newPassword }),
    }),
};

// Restaurant APIs
export const restaurantAPI = {
  getAll: (filters?: {
    search?: string;
    cuisine?: string;
    sortBy?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.cuisine) params.append('cuisine', filters.cuisine);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);

    const queryString = params.toString();
    return apiCall(`/restaurants${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: string) => apiCall(`/restaurants/${id}`),

  getMenu: (id: string) => apiCall(`/restaurants/${id}/menu`),
};

// Order APIs
export const orderAPI = {
  create: (data: {
    items: Array<{
      menuItemId: string;
      quantity: number;
      price: number;
    }>;
    deliveryAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    specialInstructions?: string;
    promoCode?: string;
  }) => apiCall('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getAll: () => apiCall('/orders'),

  getById: (id: string) => apiCall(`/orders/${id}`),

  cancelOrder: (id: string) => apiCall(`/orders/${id}/cancel`, {
    method: 'POST',
  }),

  updateDeliveryAddress: (id: string, address: any) =>
    apiCall(`/orders/${id}/delivery-address`, {
      method: 'PUT',
      body: JSON.stringify(address),
    }),
};

// Payment APIs
export const paymentAPI = {
  createOrder: (amount: number, currency: string = 'INR') =>
    apiCall('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ amount, currency }),
    }),

  verifyPayment: (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    orderId: string;
  }) => apiCall('/payments/verify', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Review APIs
export const reviewAPI = {
  submit: (data: {
    orderId: string;
    rating: number;
    comment: string;
  }) => apiCall('/reviews', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getRestaurantReviews: (restaurantId: string) =>
    apiCall(`/reviews/restaurant/${restaurantId}`),
};

export default {
  authAPI,
  userAPI,
  restaurantAPI,
  orderAPI,
  paymentAPI,
  reviewAPI,
};
