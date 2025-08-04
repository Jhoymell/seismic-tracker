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
      isNewsPanelVisible: true, // Añadido para controlar la visibilidad del panel de noticias
      // Acción para alternar la visibilidad del panel de noticias
      toggleNewsPanel: () =>
        set((state) => ({ isNewsPanelVisible: !state.isNewsPanelVisible })),
      // Acción para iniciar sesión
      // Acción para iniciar sesión
      login: (tokens) => {
        const decodedToken = jwtDecode(tokens.access);
        // Si el token tiene ruta_fotografia_url, úsala; si no, usa ruta_fotografia
        const fotoUrl = decodedToken.ruta_fotografia_url || decodedToken.ruta_fotografia || null;
        set({
          accessToken: tokens.access,
          refreshToken: tokens.refresh,
          // Ahora guardamos el objeto de usuario completo que nos interesa
          user: {
            id: decodedToken.user_id,
            email: decodedToken.email,
            tipo_usuario: decodedToken.tipo_usuario,
            username: decodedToken.username, // Asegúrate de que el token contiene este campo
            first_name: decodedToken.first_name, // Añadido para mostrar el nombre en el header
            ruta_fotografia: fotoUrl, // Añadido para la foto de perfil
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
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

      // Acción para actualizar el perfil del usuario en el store
      updateUserProfile: (profileData) => {
        // Siempre guarda la URL absoluta en ruta_fotografia
        const fotoUrl = profileData.ruta_fotografia_url || profileData.ruta_fotografia || null;
        set((state) => ({
          user: { ...state.user, ...profileData, ruta_fotografia: fotoUrl },
        }));
      },
    }),
    {
      name: "auth-storage",
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
