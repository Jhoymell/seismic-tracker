import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import toast, { Toaster } from 'react-hot-toast';
import { useDebounce } from 'use-debounce'; // Instalaremos esta librería útil

import { getSismos } from '../api/sismos';
import MapFilters from '../components/map/MapFilters'; // Importar el componente de filtros
import './MapPage.css';

const MapPage = () => {
  const [sismos, setSismos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado para los filtros
  const [filters, setFilters] = useState({
    magnitud__gte: '4.5',
    search: '',
  });

  // Usamos 'debounce' para el filtro de búsqueda de texto.
  // Esto evita hacer una llamada a la API en cada tecla que se presiona.
  // Solo se ejecutará la búsqueda 500ms después de que el usuario deje de escribir.
  const [debouncedFilters] = useDebounce(filters, 500);
  const latestSismoTimestamp = useRef(null);

  const fetchSismos = useCallback(async (currentFilters) => {
    setLoading(true);
    try {
      const params = {
        magnitud__gte: currentFilters.magnitud__gte,
        search: currentFilters.search,
      };
      const data = await getSismos(params);
      setSismos(data);

      // Guardar la fecha del sismo más reciente para el polling
      if (data.length > 0) {
        latestSismoTimestamp.current = data[0].fecha_hora_evento;
      }
    } catch (error) {
      toast.error("No se pudieron cargar los datos de los sismos.");
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
          toast.success(`${nuevosSismos.length} nuevo(s) sismo(s) detectado(s)!`);
          // Añadir los nuevos sismos al principio de la lista
          setSismos(prevSismos => [...nuevosSismos, ...prevSismos]);
          latestSismoTimestamp.current = nuevosSismos[0].fecha_hora_evento;
        }
      } catch (error) {
        console.error("Error durante el polling:", error);
      }
    }, 60000); // 60000 ms = 60 segundos

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
  }, []);


  return (
    <div className="map-page-container">
      <Toaster position="top-center" />
      <MapFilters filters={filters} setFilters={setFilters} />

      {loading && <div className="loading-overlay">Cargando...</div>}

      <MapContainer center={[9.63, -84.08]} zoom={7} className="map-container">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sismos.map(sismo => (
          <Marker key={sismo.id_evento_usgs} position={[sismo.latitud, sismo.longitud]}>
            <Popup>
              {/* ... Contenido del Popup sin cambios ... */}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapPage;