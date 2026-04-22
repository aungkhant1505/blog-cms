import axios from 'axios';

const api = axios.create({
    // Replace with your local Laravel URL for now (e.g., http://headless-cms.test/api)
    baseURL: 'https://xa2xbe3lnd.execute-api.us-east-1.amazonaws.com/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    }
});

// This "Interceptor" automatically attaches your token to every request
api.interceptors.request.use(config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
// https://xa2xbe3lnd.execute-api.us-east-1.amazonaws.com
// http://localhost:8000/api