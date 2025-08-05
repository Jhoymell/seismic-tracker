import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getSismos } from '../../api/sismos';
import { Box, CircularProgress } from '@mui/material';

const MapPreview = () => {
  const [sismos, setSismos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestSismos = async () => {
      try {
        // Pedimos todos los sismos y nos quedamos solo con los 5 más recientes
        const data = await getSismos();
        setSismos(data.slice(0, 5));
      } catch (error) {
        console.error("Error al cargar los sismos para la vista previa:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestSismos();
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ height: '400px', width: '100%', borderRadius: '1rem', overflow: 'hidden', pointerEvents: 'none' }}>
      <MapContainer 
        center={[20, 0]} // Centrado globalmente
        zoom={1.5} 
        style={{ height: '100%', width: '100%' }}
        // Deshabilitamos toda interacción del usuario con el mapa
        dragging={false}
        zoomControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sismos.map(sismo => (
          <Marker key={sismo.id_evento_usgs} position={[sismo.latitud, sismo.longitud]}>
            <Popup>
              Magnitud: {sismo.magnitud} Mw<br />{sismo.lugar_descripcion}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

export default MapPreview;