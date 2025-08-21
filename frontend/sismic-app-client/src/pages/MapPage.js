import PageTransition from '../components/utils/PageTransition';
import React, { useState, useEffect, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import toast, { Toaster } from "react-hot-toast";
import { useDebounce } from "use-debounce";
import { Box, Typography } from "@mui/material";
import { getSismos } from "../api/sismos";
import MapFilters from "../components/map/MapFilters";
import "./MapPage.css";
import dayjs from "dayjs";
import { sismoIcon } from '../components/map/mapIcons';
import { 
  SectionBackground, 
  StyledCard, 
  PageContainer
} from '../components/shared/StyledComponents';

// Usamos Box de MUI para mantener consistencia con el estilo
const MapPage = () => {
  const [sismos, setSismos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado para los filtros
  const [filters, setFilters] = useState({
    magnitud__gte: 4.5,
    search: "",
    selectedDate: null, // Fecha seleccionada
  });

  // Usamos 'debounce' para el filtro de búsqueda de texto.
  // Esto evita hacer una llamada a la API en cada tecla que se presiona.
  // Solo se ejecutará la búsqueda 500ms después de que el usuario deje de escribir.
  const [debouncedFilters] = useDebounce(filters, 500);
  const latestSismoTimestamp = useRef(null);

  const fetchSismos = useCallback(async (currentFilters) => {
    setLoading(true);
    try {
      // 2. Construimos los parámetros dinámicamente
      const params = {
        magnitud__gte: currentFilters.magnitud__gte,
        search: currentFilters.search,
      };

      // Si hay fechas, las formateamos y las añadimos a los parámetros
      if (currentFilters.selectedDate) {
        params.fecha_hora_evento__date = dayjs(currentFilters.selectedDate).format(
          "YYYY-MM-DD"
        );
      }

      const data = await getSismos(params);
      setSismos(data);
      // ...
    } catch (error) {
      // ...
    } finally {
      setLoading(false);
    }
  }, []);

  // Efecto inicial para cargar los datos y cada vez que los filtros (debounced) cambian
  useEffect(() => {
    fetchSismos(debouncedFilters);
  }, [debouncedFilters, fetchSismos]);

  // Efecto para el polling de nuevos sismos cada 60 segundos
  useEffect(() => {
    const interval = setInterval(async () => {
      console.log("Buscando nuevos sismos...");
      try {
        const params = { since_date: latestSismoTimestamp.current };
        const nuevosSismos = await getSismos(params);

        if (nuevosSismos.length > 0) {
          toast.success(
            `${nuevosSismos.length} nuevo(s) sismo(s) detectado(s)!`
          );
          // Añadir los nuevos sismos al principio de la lista
          setSismos((prevSismos) => [...nuevosSismos, ...prevSismos]);
          latestSismoTimestamp.current = nuevosSismos[0].fecha_hora_evento;
        }
      } catch (error) {
        console.error("Error durante el polling:", error);
      }
    }, 60000); // 60000 ms = 60 segundos

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
  }, []);

  return (
    <PageTransition>
      <SectionBackground sx={{ py: 0, minHeight: '100vh' }}>
        <Toaster position="top-center" />
        <PageContainer maxWidth="xl" sx={{ py: 2 }}>
          <MapFilters filters={filters} setFilters={setFilters} />
          <StyledCard 
            elevation={3}
            sx={{ 
              height: "calc(100vh - 200px)", 
              width: "100%", 
              p: 1, 
              borderRadius: '1.5rem',
              overflow: 'hidden'
            }}
          >
            {loading && (
              <Box 
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(10, 18, 30, 0.8)',
                  zIndex: 1000,
                  color: '#2196f3',
                  fontSize: '1.2rem',
                  fontWeight: 600,
                }}
              >
                Cargando datos sísmicos...
              </Box>
            )}
            <MapContainer
              center={[9.63, -84.08]}
              zoom={7}
              style={{ height: "100%", width: "100%", borderRadius: '1.5rem' }}
            >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          { sismos.map((sismo) => (
  <Marker
    key={sismo.id_evento_usgs}
    position={[sismo.latitud, sismo.longitud]}
    icon={sismoIcon} // usamos el ícono personalizado
  >
    <Popup>
      <Box sx={{ minWidth: 200 }}>
        <Typography variant="subtitle2" component="h3" gutterBottom>
          {sismo.lugar_descripcion || "Ubicación no disponible"}
        </Typography>
        <Typography variant="body2">
          <strong>Magnitud:</strong> {sismo.magnitud} Mw
        </Typography>
        <Typography variant="body2">
          <strong>Profundidad:</strong> {sismo.profundidad} km
        </Typography>
        <Typography variant="body2">
          <strong>Fecha:</strong> {new Date(sismo.fecha_hora_evento).toLocaleString()}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <a 
            href={sismo.url_usgs} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#2196f3', textDecoration: 'none' }}
          >
            Ver más detalles en USGS
          </a>
        </Typography>
      </Box>
    </Popup>
  </Marker>
)) }
            </MapContainer>
          </StyledCard>
        </PageContainer>
      </SectionBackground>
    </PageTransition>
  );
};

export default MapPage;
