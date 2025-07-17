import axios from 'axios';
import useAuthStore from '../store/authStore';
import { jwtDecode } from 'jwt-decode';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

// Función para verificar si el token está próximo a expirar (75% del tiempo transcurrido)
const isTokenNearExpiration = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = decoded.exp - currentTime;
    const totalTokenLife = decoded.exp - decoded.iat;
    return timeUntilExpiry < (totalTokenLife * 0.25); // Renueva cuando queda 25% o menos de vida
  } catch {
    return false;
  }
};

// Función para refrescar el token
const refreshAccessToken = async () => {
  const { refreshToken, login } = useAuthStore.getState();
  try {
    const response = await axios.post(`${apiClient.defaults.baseURL}/token/refresh/`, {
      refresh: refreshToken,
    });
    const newTokens = {
      access: response.data.access,
      refresh: refreshToken,
    };
    login(newTokens);
    return newTokens.access;
  } catch (error) {
    throw error;
  }
};

// --- INTERCEPTOR DE PETICIÓN (Request Interceptor) ---
// Se ejecuta ANTES de que cada petición se envíe y verifica si el token necesita renovación
apiClient.interceptors.request.use(
  async (config) => {
    const { accessToken } = useAuthStore.getState();
    
    // Si tenemos un token, verificamos si necesita ser renovado
    if (accessToken) {
      try {
        // Si el token está próximo a expirar, lo renovamos proactivamente
        if (isTokenNearExpiration(accessToken)) {
          console.log("Token próximo a expirar, renovando proactivamente...");
          const newToken = await refreshAccessToken();
          config.headers.Authorization = `Bearer ${newToken}`;
        } else {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch (error) {
        console.error("Error al renovar el token proactivamente:", error);
        // Si falla la renovación proactiva, seguimos con el token actual
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
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

      console.log("Access token expirado. Intentando refrescar como último recurso...");

      try {
        // Intentamos refrescar el token usando nuestra función centralizada
        const newToken = await refreshAccessToken();
        
        // Actualizamos la cabecera de la petición original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

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