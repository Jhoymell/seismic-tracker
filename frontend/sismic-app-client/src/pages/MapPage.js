import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { sismoIcon } from '../components/map/mapIcons';
import MapFilters from '../components/map/MapFilters';
import { getSismos } from '../api/sismos';
import { useDebounce } from 'use-debounce';
import dayjs from 'dayjs';
import toast, { Toaster } from 'react-hot-toast';

// Página del mapa: versión funcional reconstruida con filtros + polling + marcadores
const MapPage = () => {
  // Estado de sismos y carga
  const [sismos, setSismos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [filters, setFilters] = useState({
    magnitud__gte: 4.5,
    search: '',
    selectedDate: null,
  });
  const [debouncedFilters] = useDebounce(filters, 500);

  // Control de montaje diferido para asegurar tamaño estable
  const [isMapReady, setIsMapReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setIsMapReady(true), 120); // pequeño delay
    return () => clearTimeout(t);
  }, []);

  // Timestamp del último sismo para polling incremental
  const latestSismoTimestamp = useRef(null);
  const mapRef = useRef(null);

  // Fetch principal con filtros
  const fetchSismos = useCallback(async (currentFilters) => {
    setLoading(true);
    try {
      const params = { magnitud__gte: currentFilters.magnitud__gte || 4.5 };
      if (currentFilters.search) params.search = currentFilters.search;
      if (currentFilters.selectedDate) {
        params.fecha_hora_evento__date = dayjs(currentFilters.selectedDate).format('YYYY-MM-DD');
      }
      const data = await getSismos(params);
      setSismos(data);
      if (data.length > 0) {
        latestSismoTimestamp.current = data[0].fecha_hora_evento;
      }
    } catch (err) {
      console.error('Error fetch sismos', err);
      toast.error('Error al cargar sismos');
    } finally {
      setLoading(false);
      // Invalidate una vez que llegaron datos (por si cambió layout)
      setTimeout(() => {
        if (mapRef.current) mapRef.current.invalidateSize();
      }, 80);
    }
  }, []);

  // Efecto sobre filtros (debounce)
  useEffect(() => {
    fetchSismos(debouncedFilters);
  }, [debouncedFilters, fetchSismos]);

  // Polling cada 60s para nuevos sismos
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        if (!latestSismoTimestamp.current) return; // evitar primera vuelta vacía
        const params = { since_date: latestSismoTimestamp.current };
        const nuevos = await getSismos(params);
        if (nuevos.length > 0) {
          toast.success(`${nuevos.length} nuevo(s) sismo(s)`);
          setSismos(prev => [...nuevos, ...prev]);
          latestSismoTimestamp.current = nuevos[0].fecha_hora_evento;
        }
      } catch (e) {
        console.error('Polling error', e);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Marcadores memorizados
  const markers = useMemo(() => {
    return sismos
      .filter(s => s.latitud != null && s.longitud != null)
      .map((s, idx) => {
        const lat = typeof s.latitud === 'string' ? parseFloat(s.latitud) : s.latitud;
        const lng = typeof s.longitud === 'string' ? parseFloat(s.longitud) : s.longitud;
        if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
        return (
          <Marker key={`${s.id_evento_usgs || 'evt'}-${idx}`} position={[lat, lng]} icon={sismoIcon}>
            <Popup>
              <div style={{ minWidth: 200 }}>
                <strong>{s.lugar_descripcion || 'Ubicación no disponible'}</strong><br />
                Magnitud: {s.magnitud} Mw<br />
                Profundidad: {s.profundidad} km<br />
                Fecha: {new Date(s.fecha_hora_evento).toLocaleString()}<br />
                {s.url_usgs && (
                  <a href={s.url_usgs} target="_blank" rel="noopener noreferrer">USGS</a>
                )}
              </div>
            </Popup>
          </Marker>
        );
      });
  }, [sismos]);

  return (
    <div style={{
      width: '100%',
      height: 'calc(100vh - 64px)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      padding: '12px 12px 16px',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 1
    }}>
      <Toaster position="top-center" />
      {/* Filtros */}
      <div style={{ width: '100%', maxWidth: 1220, margin: '0 auto' }}>
        <MapFilters filters={filters} setFilters={setFilters} />
      </div>
      {/* Contenedor del mapa */}
      <div style={{ flex: 1, position: 'relative', width: '100%', maxWidth: 1220, margin: '0 auto', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 16px 0 #00bcd422', backdropFilter: 'blur(4px)', background: 'rgba(10,18,30,0.55)' }}>
        {loading && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(2px)', color: '#fff', fontWeight: 600 }}>
            Cargando sismos...
          </div>
        )}
        {isMapReady ? (
          <MapContainer
            center={[9.63, -84.08]}
            zoom={7}
            style={{ height: '100%', width: '100%' }}
            whenCreated={(map) => {
              mapRef.current = map;
              setTimeout(() => map.invalidateSize(), 60);
            }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers}
          </MapContainer>
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Inicializando mapa...</div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
