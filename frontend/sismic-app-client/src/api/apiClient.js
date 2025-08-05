import axios from 'axios';
import useAuthStore from '../store/authStore';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

// --- INTERCEPTOR DE PETICIÓN (Request Interceptor) ---
// Este ya lo teníamos. Se ejecuta ANTES de que cada petición se envíe.
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// --- NUEVO INTERCEPTOR DE RESPUESTA (Response Interceptor) ---
// Se ejecuta DESPUÉS de recibir una respuesta (o un error) del backend.
apiClient.interceptors.response.use(
  // Si la respuesta es exitosa (ej: status 200), simplemente la devuelve.
  (response) => response,

  // Si la respuesta es un error...
  async (error) => {
    const originalRequest = error.config;
    const { refreshToken, logout, login } = useAuthStore.getState();

    // Si el error es 401, el accessToken expiró.
    // Y nos aseguramos de no estar ya en un ciclo de refresco.
    if (error.response.status === 401 && refreshToken && !originalRequest._retry) {
      originalRequest._retry = true; // Marcamos la petición para no reintentarla infinitamente.

      console.log("Access token expirado. Intentando refrescar...");

      try {
        // Hacemos la petición al endpoint de refresco
        const response = await axios.post(`${apiClient.defaults.baseURL}/token/refresh/`, {
          refresh: refreshToken,
        });

        const newTokens = {
            access: response.data.access,
            refresh: refreshToken, // El refresh token suele seguir siendo el mismo
        };

        // Actualizamos el estado global con el nuevo token
        login(newTokens); 
        console.log("Token refrescado con éxito.");

        // Actualizamos la cabecera de la petición original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;

        // Reintentamos la petición original que había fallado
        return apiClient(originalRequest);

      } catch (refreshError) {
        // Si el refresco también falla, el refreshToken expiró.
        console.error("No se pudo refrescar el token. Cerrando sesión.");
        logout();
        // Redirigimos al login (opcional, ya que los ProtectedRoute lo harán)
        window.location.href = '/login'; 
        return Promise.reject(refreshError);
      }
    }

    // Para cualquier otro error, simplemente lo devolvemos.
    return Promise.reject(error);
  }
);

export default apiClient;