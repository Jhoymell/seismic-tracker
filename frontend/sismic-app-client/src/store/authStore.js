import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

/**
 * AuthStore - Store global de autenticación y estado de UI
 * 
 * Gestiona:
 * - Estado de autenticación del usuario (tokens, datos de usuario)
 * - Estado del sidebar lateral (abierto/cerrado)
 * - Estado del panel de noticias (visible/oculto)
 * 
 * Persistencia:
 * - Los datos de autenticación se guardan en localStorage
 * - Los estados de UI (sidebar, panel) no se persisten
 * 
 * Funcionalidades:
 * - Login/logout con JWT tokens
 * - Decodificación automática de tokens JWT
 * - Control del sidebar responsivo
 * - Control del panel lateral de noticias
 * - Actualización del perfil de usuario
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      // === ESTADO DE AUTENTICACIÓN ===
      /** @type {string|null} Token de acceso JWT */
      accessToken: null,
      /** @type {string|null} Token de refresh JWT */
      refreshToken: null,
      /** @type {Object|null} Datos del usuario autenticado */
      user: null,
      /** @type {boolean} Estado de autenticación */
      isAuthenticated: false,

      // === ESTADO DE UI ===
      /** @type {boolean} Estado del sidebar lateral (principalmente móvil) */
      isSidebarOpen: false,
      /** @type {boolean} Visibilidad del panel de noticias lateral */
      isNewsPanelVisible: true,

      // === ACCIONES DE UI ===
      /**
       * Alterna la visibilidad del panel de noticias
       */
      toggleNewsPanel: () =>
        set((state) => ({ isNewsPanelVisible: !state.isNewsPanelVisible })),

      /**
       * Abre el sidebar (principalmente para móvil)
       */
      openSidebar: () => set({ isSidebarOpen: true }),

      /**
       * Cierra el sidebar
       */
      closeSidebar: () => set({ isSidebarOpen: false }),

      /**
       * Alterna el estado del sidebar
       */
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

      // === ACCIONES DE AUTENTICACIÓN ===
      /**
       * Inicia sesión del usuario
       * @param {Object} tokens - Objeto con access y refresh tokens
       * @param {string} tokens.access - JWT access token
       * @param {string} tokens.refresh - JWT refresh token
       */
      login: (tokens) => {
        try {
          const decodedToken = jwtDecode(tokens.access);
          
          // Determinar la URL de la foto de perfil
          const fotoUrl = decodedToken.ruta_fotografia_url || 
                          decodedToken.ruta_fotografia || 
                          null;
          
          set({
            accessToken: tokens.access,
            refreshToken: tokens.refresh,
            // Crear objeto de usuario completo desde el token decodificado
            user: {
              id: decodedToken.user_id,
              email: decodedToken.email,
              tipo_usuario: decodedToken.tipo_usuario,
              username: decodedToken.username,
              first_name: decodedToken.first_name,
              ruta_fotografia: fotoUrl,
            },
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Error al decodificar el token:', error);
          // En caso de error, no autenticar
          set({
            accessToken: null,
            refreshToken: null,
            user: null,
            isAuthenticated: false,
          });
        }
      },

      /**
       * Cierra la sesión del usuario y limpia el estado
       */
      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });
      },

      /**
       * Actualiza los datos del perfil del usuario en el store
       * @param {Object} profileData - Nuevos datos del perfil
       */
      updateUserProfile: (profileData) => {
        // Determinar la URL de la foto actualizada
        const fotoUrl = profileData.ruta_fotografia_url || 
                        profileData.ruta_fotografia || 
                        null;
        
        set((state) => ({
          user: { 
            ...state.user, 
            ...profileData, 
            ruta_fotografia: fotoUrl 
          },
        }));
      },
    }),
    {
      name: "auth-storage",
      /**
       * Configuración de persistencia:
       * Solo persiste datos de autenticación, no estados de UI
       */
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
