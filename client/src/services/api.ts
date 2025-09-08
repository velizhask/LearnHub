import axios from 'axios';

// Gunakan environment variable, fallback ke localhost
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10s
});


// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle rate limiting (429)
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'] || 60;
      console.warn(`Rate limited. Retrying after ${retryAfter} seconds`);
      
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        return api(originalRequest);
      }
    }
    
    // Handle auth errors (401)
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    // Handle server errors (5xx)
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.status);
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: { email: string; password: string; name: string }) =>
    api.post('/auth/register', userData),
  
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  getCurrentUser: () => api.get('/auth/me'),
  
  updateProfile: (profileData: { name: string; profileImage?: string }) =>
    api.patch('/auth/profile', profileData),
  
  deleteProfileImage: () => api.delete('/auth/profile/image'),
};

// Books API
export const booksAPI = {
  search: (query: string, startIndex = 0, maxResults = 12) =>
    api.get('/books/search', {
      params: { q: query, startIndex, maxResults }
    }),
  
  getFeatured: () => api.get('/books/featured'),
};

// Goals API
export const goalsAPI = {
  getGoals: () => api.get('/goals'),
  
  updateGoals: (goals: { yearlyGoal: number; monthlyGoal: number; dailyGoal: number; goalType: string }) =>
    api.patch('/goals', goals),
};

// Library API
export const libraryAPI = {
  getLibrary: () => api.get('/library'),
  
  addBook: (book: { bookId: string; title: string; authors: string[]; thumbnail: string }) =>
    api.post('/library/add', book),
  
  removeBook: (bookId: string) => api.delete(`/library/${bookId}`),
  
  updateBookStatus: (bookId: string, readingStatus: string) =>
    api.patch(`/library/${bookId}/status`, { readingStatus }),
};

// Notifications API
export const notificationsAPI = {
  sendEmail: (data: { to: string; subject: string; message: string }) =>
    api.post('/notifications/email', data),
  
  updateSettings: (settings: { emailNotifications: boolean; pushNotifications: boolean; readingReminders: boolean }) =>
    api.patch('/notifications/settings', settings),
};

export default api;