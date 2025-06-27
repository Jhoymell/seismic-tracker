import axios from 'axios';
import useAuthStore from '../store/authStore';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

// Usamos un interceptor para añadir el token a cada petición
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState(); // Obtenemos el token del store
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;