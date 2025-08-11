
import PageTransition from '../components/utils/PageTransition';
import React, { useState, useEffect, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import toast, { Toaster } from "react-hot-toast";
import { useDebounce } from "use-debounce";
import { Paper } from "@mui/material";
import { getSismos } from "../api/sismos";
import MapFilters from "../components/map/MapFilters";
import "./MapPage.css";
import dayjs from "dayjs";

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
      <Toaster position="top-center" />
      <MapFilters filters={filters} setFilters={setFilters} />
      <Paper
        elevation={3}
        sx={{ height: "calc(100vh - 220px)", width: "100%" }}
      >
        {loading && <div className="loading-overlay">Cargando...</div>}
        <MapContainer
          center={[9.63, -84.08]}
          zoom={7}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {sismos.map((sismo) => (
            <Marker
              key={sismo.id_evento_usgs}
              position={[sismo.latitud, sismo.longitud]}
            >
              <Popup>
                <div>
                  <h3>
                    {sismo.lugar_descripcion || "Ubicación no disponible"}
                  </h3>
                  <p>
                    <strong>Latitud:</strong> {sismo.latitud}
                  </p>
                  <p>
                    <strong>Longitud:</strong> {sismo.longitud}
                  </p>
                  <p>
                    <strong>Magnitud:</strong> {sismo.magnitud} Mw
                  </p>
                  <p>
                    <strong>Profundidad:</strong> {sismo.profundidad} km
                  </p>
                  <p>
                    <strong>Fecha:</strong>{" "}
                    {new Date(sismo.fecha_hora_evento).toLocaleString()}
                  </p>
                  <a
                    href={sismo.url_usgs}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Más detalles en USGS
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Paper>
    </PageTransition>
  );
};

export default MapPage;
