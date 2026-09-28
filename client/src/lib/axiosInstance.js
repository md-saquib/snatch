import axios from 'axios';

// 1. AXIOS INSTANCE
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. REQUEST INTERCEPTOR (Token attach karta hai)
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. RESPONSE INTERCEPTOR (Refresh token handle karta hai)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Agar 401 (Unauthorized) aaye aur yeh request pehle retry nahi hui hai
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Infinite loop rokne ke liye flag

      try {
        // Naya token maango (bina axiosInstance use kiye taaki loop na bane)
        const { data } = await axios.get('/api/auth/refreshToken', {
          withCredentials: true,
        });

        const newAccessToken = data.data.accessToken;

        // Naya token save karo
        localStorage.setItem('accessToken', newAccessToken);

        // Purani fail hui request mein naya token daalo aur wapas chalao
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        // Agar refresh token bhi expire ho gaya ho, toh sab clear karke login pe bhejo
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error); // Agar 401 ke alawa koi error ho (jaise 404, 500)
  }
);

export default axiosInstance;