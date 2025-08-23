// ========================================
// COMPONENTE: MapPage (OPTIMIZADO)
// PROPÓSITO: Página principal con mapa interactivo de sismos en tiempo real
// ========================================

import PageTransition from '../components/utils/PageTransition'; // Transiciones de página
import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";

// Importaciones de React-Leaflet para el mapa interactivo
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import toast, { Toaster } from "react-hot-toast"; // Sistema de notificaciones
import { useDebounce } from "use-debounce"; // Hook para optimizar búsquedas
import { Paper, Box, Typography } from "@mui/material"; // Componentes de Material-UI

// Importaciones locales
import { getSismos } from "../api/sismos"; // API para obtener datos sísmicos
import MapFilters from "../components/map/MapFilters"; // Componente de filtros
import "./MapPage.css"; // Estilos específicos del mapa
import dayjs from "dayjs"; // Librería para manejo de fechas
import { sismoIcon } from '../components/map/mapIcons'; // Iconos personalizados para marcadores
import { commonStyles, spacing } from '../styles/commonStyles'; // Estilos comunes

// ========================================
// COMPONENTE PRINCIPAL: MapPage
// ========================================

/**
 * COMPONENTE PRINCIPAL: MapPage (OPTIMIZADO)
 * 
 * Funcionalidades principales:
 * 1. Mapa interactivo con marcadores de sismos
 * 2. Sistema de filtros (magnitud, búsqueda, fecha)
 * 3. Actualización automática cada 60 segundos (polling)
 * 4. Búsqueda con debounce para optimizar rendimiento
 * 5. Notificaciones de nuevos sismos detectados
 * 6. Memorización de marcadores para mejor rendimiento
 */
const MapPage = () => {
  // ========================================
  // ESTADO DEL COMPONENTE
  // ========================================
  
  const [sismos, setSismos] = useState([]); // Lista de sismos a mostrar en el mapa
  const [loading, setLoading] = useState(true); // Estado de carga

  // Estado para los filtros del mapa
  const [filters, setFilters] = useState({
    magnitud__gte: 4.5, // Magnitud mínima (por defecto 4.5)
    search: "", // Búsqueda por texto
    selectedDate: null, // Fecha específica seleccionada
  });

  // ========================================
  // OPTIMIZACIÓN CON DEBOUNCE
  // ========================================
  
  /**
   * Debounce para el filtro de búsqueda de texto.
   * Evita hacer una llamada a la API en cada tecla presionada.
   * Solo ejecuta la búsqueda 500ms después de que el usuario deje de escribir.
   */
  const [debouncedFilters] = useDebounce(filters, 500);
  
  // Referencia para almacenar el timestamp del último sismo (para polling)
  const latestSismoTimestamp = useRef(null);

  // ========================================
  // FUNCIÓN PARA OBTENER SISMOS
  // ========================================
  
  /**
   * Función para obtener sismos desde la API con filtros aplicados
   * @param {Object} currentFilters - Filtros actuales a aplicar
   */
  const fetchSismos = useCallback(async (currentFilters) => {
    setLoading(true); // Inicia el estado de carga
    try {
      // ========================================
      // CONSTRUCCIÓN DINÁMICA DE PARÁMETROS
      // ========================================
      
      // Construimos los parámetros de búsqueda dinámicamente
      const params = {
        magnitud__gte: currentFilters.magnitud__gte, // Magnitud mínima
        search: currentFilters.search, // Término de búsqueda
      };

      // Si hay una fecha seleccionada, la formateamos y añadimos a los parámetros
      if (currentFilters.selectedDate) {
        params.fecha_hora_evento__date = dayjs(currentFilters.selectedDate).format(
          "YYYY-MM-DD"
        );
      }

      // ========================================
      // LLAMADA A LA API
      // ========================================
      
      const data = await getSismos(params); // Obtiene sismos desde el backend
      setSismos(data); // Actualiza el estado con los nuevos datos
      
      // Actualiza el timestamp del último sismo para el polling
      if (data.length > 0) {
        latestSismoTimestamp.current = data[0].fecha_hora_evento;
      }
      
    } catch (error) {
      // Manejo de errores con notificación al usuario
      console.error("Error fetching sismos:", error);
      toast.error("Error al cargar los datos sísmicos");
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  }, []);

  // ========================================
  // EFECTO PARA CARGA INICIAL Y FILTROS
  // ========================================
  
  /**
   * Efecto que se ejecuta:
   * 1. Al montar el componente (carga inicial)
   * 2. Cada vez que los filtros con debounce cambian
   */
  useEffect(() => {
    fetchSismos(debouncedFilters);
  }, [debouncedFilters, fetchSismos]);

  // ========================================
  // SISTEMA DE POLLING PARA NUEVOS SISMOS
  // ========================================
  
  /**
   * Efecto para el polling automático de nuevos sismos cada 60 segundos.
   * Permite mantener la información actualizada en tiempo real.
   */
  useEffect(() => {
    const interval = setInterval(async () => {
      console.log("Buscando nuevos sismos...");
      try {
        // Busca sismos más recientes que el último conocido
        const params = { since_date: latestSismoTimestamp.current };
        const nuevosSismos = await getSismos(params);

        if (nuevosSismos.length > 0) {
          // Notifica al usuario sobre nuevos sismos
          toast.success(
            `${nuevosSismos.length} nuevo(s) sismo(s) detectado(s)!`
          );
          
          // Añade los nuevos sismos al principio de la lista
          setSismos((prevSismos) => [...nuevosSismos, ...prevSismos]);
          
          // Actualiza el timestamp del último sismo
          latestSismoTimestamp.current = nuevosSismos[0].fecha_hora_evento;
        }
      } catch (error) {
        console.error("Error durante el polling:", error);
      }
    }, 60000); // 60000 ms = 60 segundos

    // Cleanup: limpiar el intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, []);

  // ========================================
  // OPTIMIZACIÓN DE RENDIMIENTO
  // ========================================
  
  /**
   * Memorización de marcadores para evitar re-renderizado innecesario
   * Solo se recalcula cuando cambia la lista de sismos
   */
  const memoizedMarkers = useMemo(() => {
    return sismos.map((sismo) => (
      <Marker
        key={sismo.id_evento_usgs} // ID único del evento USGS
        position={[sismo.latitud, sismo.longitud]} // Posición geográfica
        icon={sismoIcon} // Icono personalizado para sismos
      >
        {/* ========================================
            POPUP CON INFORMACIÓN DETALLADA
        ======================================== */}
        <Popup>
          <Box sx={{ minWidth: 200 }}>
            {/* Título con la ubicación del sismo */}
            <Typography variant="subtitle2" component="h3" gutterBottom>
              {sismo.lugar_descripcion || "Ubicación no disponible"}
            </Typography>
            
            {/* Información de magnitud */}
            <Typography variant="body2">
              <strong>Magnitud:</strong> {sismo.magnitud} Mw
            </Typography>
            
            {/* Información de profundidad */}
            <Typography variant="body2">
              <strong>Profundidad:</strong> {sismo.profundidad} km
            </Typography>
            
            {/* Fecha y hora del evento */}
            <Typography variant="body2">
              <strong>Fecha:</strong> {new Date(sismo.fecha_hora_evento).toLocaleString()}
            </Typography>
            
            {/* Enlace externo a USGS para más detalles */}
            <Typography variant="body2" sx={{ mt: 1 }}>
              <a href={sismo.url_usgs} target="_blank" rel="noopener noreferrer">
                Ver más detalles en USGS
              </a>
            </Typography>
          </Box>
        </Popup>
      </Marker>
    ));
  }, [sismos]);

  // ========================================
  // RENDERIZADO DEL COMPONENTE
  // ========================================

  return (
    <PageTransition>
      <Box sx={{ 
        ...commonStyles.pageContainer,
        p: 2, // Padding para espaciado
      }}>
        {/* Sistema de notificaciones toast */}
        <Toaster position="top-center" />
        
        {/* ========================================
            PANEL DE FILTROS
        ======================================== */}
        <MapFilters filters={filters} setFilters={setFilters} />
        
        {/* ========================================
            CONTENEDOR DEL MAPA
        ======================================== */}
        <Paper
          elevation={3} // Sombra para efecto de profundidad
          sx={{ 
            height: "calc(100vh - 220px)", // Altura dinámica basada en viewport
            width: "100%",
            borderRadius: spacing.borderRadius, // Bordes redondeados
            overflow: 'hidden', // Evita desbordamiento del contenido
          }}
        >
        {/* Overlay de carga que se muestra mientras se obtienen los datos */}
        {loading && <div className="loading-overlay">Cargando...</div>}
        
        {/* ========================================
            MAPA INTERACTIVO CON LEAFLET
        ======================================== */}
        <MapContainer
          center={[9.63, -84.08]} // Centro inicial: Costa Rica
          zoom={7} // Nivel de zoom inicial
          style={{ height: "100%", width: "100%" }}
        >
          {/* Capa de tiles de OpenStreetMap */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* ========================================
              MARCADORES DE SISMOS OPTIMIZADOS
          ======================================== */}
          {memoizedMarkers}
        </MapContainer>
      </Paper>
      </Box>
    </PageTransition>
  );
};

export default React.memo(MapPage);
