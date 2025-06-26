import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

// El store se crea con persistencia en localStorage.
// El nombre 'auth-storage' es la clave que se usará en localStorage.
const useAuthStore = create(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      // Acción para iniciar sesión
      login: (tokens) => {
        const decodedToken = jwtDecode(tokens.access);
        set({
          accessToken: tokens.access,
          refreshToken: tokens.refresh,
          user: { id: decodedToken.user_id, email: decodedToken.email }, // Ajusta según el payload de tu token
          isAuthenticated: true,
        });
      },

      // Acción para cerrar sesión
      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });
      },

      // Podríamos añadir una acción para refrescar el token aquí en el futuro
    }),
    {
      name: 'auth-storage', // Nombre del item en localStorage
    }
  )
);

export default useAuthStore;