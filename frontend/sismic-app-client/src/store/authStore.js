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
      isSidebarOpen: false,

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
      // Acción para alternar el estado del sidebar
      openSidebar: () => set({ isSidebarOpen: true }),
      closeSidebar: () => set({ isSidebarOpen: false }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    }),
    {
      name: 'auth-storage',
      // No queremos guardar el estado de la barra lateral en localStorage
      partialize: (state) => ({ 
        accessToken: state.accessToken, 
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // Podríamos añadir una acción para refrescar el token aquí en el futuro
    }
  )
);

export default useAuthStore;
