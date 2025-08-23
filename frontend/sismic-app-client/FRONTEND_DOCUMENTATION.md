# Frontend Documentation - Seismic Tracker

## 📋 Resumen del Proyecto

**Seismic Tracker** es una aplicación web moderna para el monitoreo y análisis de actividad sísmica en tiempo real. El frontend está construido con React y utiliza Material-UI para el diseño, junto con Framer Motion para animaciones suaves.

## 🛠️ Tecnologías Utilizadas

- **React 18** - Framework principal
- **Material-UI (MUI)** - Biblioteca de componentes de UI
- **Framer Motion** - Animaciones y transiciones
- **React Router DOM** - Navegación y rutas
- **Zustand** - Gestión de estado global
- **React Hook Form** - Manejo de formularios
- **Yup** - Validación de esquemas
- **Leaflet** - Mapas interactivos
- **React Hot Toast** - Notificaciones

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── admin/           # Componentes de administración
│   ├── auth/            # Componentes de autenticación
│   ├── home/            # Componentes específicos del home
│   ├── layout/          # Componentes de layout (Header, Footer, Sidebar)
│   ├── map/             # Componentes relacionados con mapas
│   ├── password/        # Componentes de manejo de contraseñas
│   ├── profile/         # Componentes de perfil de usuario
│   ├── register/        # Componentes de registro
│   └── utils/           # Utilidades y helpers
├── pages/               # Páginas principales de la aplicación
├── store/               # Estado global con Zustand
├── styles/              # Estilos y temas globales
├── api/                 # Funciones de API y comunicación con backend
├── hooks/               # Custom hooks de React
└── assets/              # Recursos estáticos
```

## 🎨 Sistema de Diseño

### Colores
- **Primario**: `#2196f3` (Azul Material)
- **Secundario**: `#00bcd4` (Cyan)
- **Acento**: `#00e5ff` (Cyan claro)
- **Fondo**: Gradientes oscuros para tema científico/tecnológico

### Animaciones
- **Transiciones de página**: Fade in/out suave (0.4s)
- **Hover effects**: Escalado sutil (1.05x)
- **Loading states**: Animaciones de esqueleto
- **Stagger animations**: Para listas y grids

## 🧩 Componentes Principales

### Layout Components

#### `MainLayout.js`
- **Propósito**: Layout principal de la aplicación
- **Funcionalidades**:
  - Estructura básica (Header, Sidebar, Content, Footer)
  - Manejo responsivo
  - Animaciones del panel lateral
  - Gestión de márgenes dinámicos

#### `Header.js`
- **Propósito**: Barra superior de navegación
- **Funcionalidades**:
  - Título de la aplicación
  - Botón para panel de noticias
  - Espacio reservado para botón del sidebar

#### `LeftNav.js`
- **Propósito**: Barra lateral de navegación
- **Funcionalidades**:
  - Navegación responsiva (overlay en móvil, fijo en desktop)
  - Hover expansion en desktop
  - Botón hamburguesa integrado
  - Opciones diferentes según autenticación

#### `Footer.js`
- **Propósito**: Pie de página informativo
- **Funcionalidades**:
  - Información del proyecto
  - Créditos de desarrolladores
  - Enlaces a fuentes de datos

### Authentication Components

#### `LoginPage.js` & `RegisterPage.js`
- **Propósito**: Manejo de autenticación de usuarios
- **Funcionalidades**:
  - Formularios validados con react-hook-form
  - Registro paso a paso con stepper
  - Validaciones robustas con Yup
  - DatePicker integrado para fecha de nacimiento

### Utility Components

#### `PageTransition.js`
- **Propósito**: Transiciones suaves entre páginas
- **Funcionalidades**:
  - Efectos fade in/out uniformes
  - Integración con React Router
  - Configuración centralizada de animaciones

## 📱 Características Responsivas

### Breakpoints
- **xs**: 0px - 599px (Móvil)
- **sm**: 600px - 899px (Tablet pequeña)
- **md**: 900px - 1199px (Tablet/Desktop pequeño)
- **lg**: 1200px+ (Desktop)

### Comportamientos Adaptativos
1. **Sidebar**:
   - Móvil: Overlay con backdrop
   - Desktop: Hover expansion + estado persistente

2. **Contenido**:
   - Móvil: Sin márgenes laterales
   - Desktop: Margen izquierdo para sidebar

3. **Texto y Espaciado**:
   - Escalado automático según breakpoint
   - Padding adaptativo

## 🔄 Gestión de Estado

### AuthStore (Zustand)
```javascript
// Estados principales:
- accessToken: string | null
- refreshToken: string | null  
- user: Object | null
- isAuthenticated: boolean
- isSidebarOpen: boolean
- isNewsPanelVisible: boolean

// Acciones principales:
- login(tokens)
- logout()
- updateUserProfile(data)
- toggleSidebar()
- toggleNewsPanel()
```

### Persistencia
- **LocalStorage**: Datos de autenticación
- **Session**: Estados de UI (no persistidos)

## 🔧 Validaciones

### Formulario de Registro

#### Paso 1 - Cuenta:
- **Email**: Formato válido + obligatorio
- **Username**: 3-30 caracteres + obligatorio
- **Password**: 8+ chars + mayúscula + minúscula + número + especial
- **Confirmación**: Debe coincidir con password

#### Paso 2 - Personal:
- **Nombre/Apellidos**: 2-50 caracteres + obligatorio
- **Teléfono**: 8-15 caracteres + obligatorio
- **Fecha Nacimiento**: Fecha válida + edad mínima 13 años

## 🎯 Mejores Prácticas Implementadas

### Código
- **Componentes funcionales** con hooks
- **Separación de responsabilidades** clara
- **Documentación JSDoc** en componentes principales
- **Manejo de errores** centralizado
- **Lazy loading** para optimización

### UX/UI
- **Feedback visual** en todas las interacciones
- **Estados de carga** con indicadores apropiados
- **Validación en tiempo real** en formularios
- **Mensajes de error** claros y útiles
- **Navegación intuitiva** y consistente

### Performance
- **Memorización** de componentes donde es necesario
- **Optimización de re-renders** con useCallback
- **Bundling optimizado** con Create React App
- **Lazy loading** de páginas

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm start                 # Inicia servidor de desarrollo

# Build
npm run build            # Construye para producción

# Testing
npm test                 # Ejecuta tests unitarios

# Análisis
npm run analyze          # Analiza el bundle size
```

## 🐛 Debugging y Problemas Comunes

### Problemas Resueltos
1. **Duplicación de botones de menú**: Eliminado botón del Header, mantenido solo en LeftNav
2. **Conflictos de sidebar**: Separación clara entre estados móvil/desktop
3. **Validación de DatePicker**: Uso correcto de Controller con react-hook-form
4. **Warnings de Framer Motion**: Actualización a sintaxis más reciente

### Tips de Debugging
- **React DevTools**: Para inspeccionar estado y props
- **Redux DevTools**: Para monitorear cambios en Zustand
- **Network Tab**: Para verificar llamadas API
- **Console warnings**: Especialmente importante para dependency arrays

## 📈 Futuras Mejoras

### Técnicas
- [ ] Implementar PWA (Progressive Web App)
- [ ] Agregar Service Workers para cache
- [ ] Optimizar bundle splitting
- [ ] Implementar tests E2E con Cypress

### Funcionales
- [ ] Modo oscuro/claro
- [ ] Soporte para más idiomas
- [ ] Notificaciones push
- [ ] Compartir en redes sociales

## 👥 Desarrolladores

- **Jhoymell Lizano** - Desarrollo Frontend Principal
- **Fabián Marín** - Desarrollo Backend y Colaboración Frontend

---

*Documentación actualizada: Enero 2025*
