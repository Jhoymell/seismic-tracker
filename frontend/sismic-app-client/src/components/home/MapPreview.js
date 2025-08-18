import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { Box, CircularProgress } from '@mui/material';
import apiClient from '../../api/apiClient';
import { sismoIcon } from '../map/mapIcons'; // <-- agregado

const MapPreview = () => {
  const [sismos, setSismos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestSismos = async () => {
      try {
        // Hacemos la petición al nuevo endpoint público (retorna los 10 más recientes)
        const response = await apiClient.get('/sismos/public/');
        setSismos(response.data);
      } catch (error) {
        console.error("Error al cargar los sismos para la vista previa:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestSismos();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '450px',
        width: '100%',
        borderRadius: '1rem',
        overflow: 'hidden',
        pointerEvents: 'none', // no interactivo en portada
      }}
    >
      <MapContainer
        center={[20, 0]} // Centrado globalmente
        zoom={1.5}
        style={{ height: '100%', width: '100%' }}
        dragging={false}
        zoomControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sismos.map((sismo) => (
          <Marker
            key={sismo.id_evento_usgs}
            position={[sismo.latitud, sismo.longitud]}
            icon={sismoIcon} // <-- icono personalizado aplicado
          />
        ))}
      </MapContainer>
    </Box>
  );
};

export default MapPreview;