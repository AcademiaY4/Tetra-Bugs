import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true, 
});

// Set up an interceptor to include the Authorization token and CSRF token in headers
axiosInstance.interceptors.request.use((config) => {
  // Get the AuthToken from local storage
  const authToken = localStorage.getItem('AuthToken');

  // Get the CSRF token from cookies
  const csrfToken = Cookies.get('XSRF-TOKEN');

  
  if (authToken) {
    config.headers['Authorization'] = `Bearer ${authToken}`;
  }

  // Set the CSRF token header if it exists
  if (csrfToken) {
    config.headers['X-XSRF-TOKEN'] = csrfToken;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

  
export default axiosInstance;

