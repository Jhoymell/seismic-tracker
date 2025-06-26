import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

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
          // Ahora guardamos el objeto de usuario completo que nos interesa
          user: {
            id: decodedToken.user_id,
            email: decodedToken.email,
            tipo_usuario: decodedToken.tipo_usuario, // <-- NUEVA LÍNEA
          },
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
      name: "auth-storage", // Nombre del item en localStorage
    }
  )
);

export default useAuthStore;
