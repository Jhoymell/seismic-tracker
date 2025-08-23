// ========================================
// CONFIGURACIÓN: backgroundConfig
// PROPÓSITO: Configuración centralizada para los fondos 3D de diferentes páginas
// ========================================

/**
 * Configuraciones específicas para cada tipo de fondo 3D
 * Permite personalizar fácilmente los efectos visuales por página
 */
export const backgroundConfigs = {
  // Configuración para el fondo general (páginas simples)
  default: {
    starsCount: 5000,
    backgroundColor: "#000011",
    enableControls: false,
    particleFields: [
      {
        count: 3000,
        color: "#ffffff",
        size: 1.5,
        speed: 0.0001,
        range: 800
      }
    ]
  },

  // Configuración para la página del mapa (temática sísmica)
  map: {
    backgroundColor: "#0a0e27",
    enableSeismicWaves: true,
    defaultSeismicIntensity: 0.3,
    particleFields: [
      {
        count: 3000,
        color: "#4ade80", // Verde para actividad normal
        size: 1.5,
        speed: 0.0005,
        range: 600
      },
      {
        count: 1000,
        color: "#f59e0b", // Amarillo para actividad sísmica
        size: 2.5,
        speed: 0.001,
        range: 400
      }
    ],
    seismicWaves: {
      rings: [
        { radius: [50, 52], color: "#ff6b35", opacity: 0.3 },
        { radius: [80, 82], color: "#ff6b35", opacity: 0.2 },
        { radius: [120, 122], color: "#ff6b35", opacity: 0.1 }
      ]
    }
  },

  // Configuración para la página de login (profesional y elegante)
  login: {
    backgroundColor: "#0f172a",
    particleFields: [
      {
        count: 1500,
        color: "#64748b", // Gris elegante
        size: 1,
        speed: 0.0003,
        range: 400
      },
      {
        count: 800,
        color: "#3b82f6", // Azul corporativo
        size: 1.5,
        speed: 0.0002,
        range: 300
      }
    ],
    floatingGeometry: {
      spheres: [
        { 
          position: [-100, 0, -200], 
          radius: 15, 
          color: "#3b82f6", 
          opacity: 0.3,
          animationType: "sine"
        },
        { 
          position: [80, -50, -150], 
          radius: 10, 
          color: "#8b5cf6", 
          opacity: 0.4,
          animationType: "cosine"
        },
        { 
          position: [0, 70, -180], 
          radius: 8, 
          color: "#06b6d4", 
          opacity: 0.5,
          animationType: "complex"
        }
      ]
    }
  },

  // Configuración para la página de perfil (personalizada y cálida)
  profile: {
    backgroundColor: "#1a1a2e",
    particleFields: [
      {
        count: 2000,
        color: "#e879f9", // Magenta suave
        size: 1.2,
        speed: 0.0004,
        range: 500
      },
      {
        count: 1200,
        color: "#fbbf24", // Amarillo cálido
        size: 1.8,
        speed: 0.0003,
        range: 350
      }
    ]
  },

  // Configuración para la página de administración (tecnológica)
  admin: {
    backgroundColor: "#0c1426",
    particleFields: [
      {
        count: 4000,
        color: "#10b981", // Verde tecnológico
        size: 1,
        speed: 0.0006,
        range: 700
      },
      {
        count: 2000,
        color: "#3b82f6", // Azul sistema
        size: 1.3,
        speed: 0.0004,
        range: 500
      },
      {
        count: 1000,
        color: "#f59e0b", // Naranja alerta
        size: 2,
        speed: 0.0008,
        range: 300
      }
    ],
    gridEffect: {
      enabled: true,
      color: "#1f2937",
      opacity: 0.2
    }
  }
};

/**
 * Utilidad para obtener configuración de fondo por nombre de página
 */
export const getBackgroundConfig = (pageName) => {
  return backgroundConfigs[pageName] || backgroundConfigs.default;
};

/**
 * Colores predefinidos para diferentes contextos
 */
export const themeColors = {
  // Paleta principal
  primary: {
    blue: "#3b82f6",
    purple: "#8b5cf6",
    cyan: "#06b6d4",
    green: "#10b981"
  },
  
  // Paleta de estado (sismos)
  seismic: {
    low: "#22c55e",      // Verde - magnitud baja
    medium: "#eab308",   // Amarillo - magnitud media
    high: "#f97316",     // Naranja - magnitud alta
    critical: "#ef4444"  // Rojo - magnitud crítica
  },
  
  // Paleta de fondo
  backgrounds: {
    dark: "#000011",
    deeper: "#0a0e27",
    professional: "#0f172a",
    warm: "#1a1a2e",
    tech: "#0c1426"
  }
};

export default backgroundConfigs;
