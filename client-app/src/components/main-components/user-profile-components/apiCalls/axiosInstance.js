import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true,
});

// Add a request interceptor to include the CSRF token in the headers
axiosInstance.interceptors.request.use((config) => {
    const csrfToken = Cookies.get('XSRF-TOKEN');  // Get the CSRF token from cookies
    if (csrfToken) {
        config.headers['X-XSRF-TOKEN'] = csrfToken;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;
