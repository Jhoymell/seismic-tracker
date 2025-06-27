import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import toast, { Toaster } from 'react-hot-toast';

import { getSismos } from '../api/sismos';
import './MapPage.css'; // Crearemos este archivo para estilos

const MapPage = () => {
  const [sismos, setSismos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSismos = async () => {
      try {
        const data = await getSismos();
        setSismos(data);
      } catch (error) {
        toast.error("No se pudieron cargar los datos de los sismos.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSismos();
  }, []); // El array vacío asegura que esto se ejecute solo una vez al montar el componente

  if (loading) {
    return <div>Cargando mapa y datos...</div>;
  }

  return (
    <div className="map-page-container">
      <Toaster position="top-center" />
      <MapContainer center={[9.63, -84.08]} zoom={8} className="map-container">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sismos.map(sismo => (
          <Marker key={sismo.id_evento_usgs} position={[sismo.latitud, sismo.longitud]}>
            <Popup>
              <div>
                <h3>{sismo.lugar_descripcion || 'Ubicación no disponible'}</h3>
                <p><strong>Magnitud:</strong> {sismo.magnitud} Mw</p>
                <p><strong>Profundidad:</strong> {sismo.profundidad} km</p>
                <p><strong>Fecha:</strong> {new Date(sismo.fecha_hora_evento).toLocaleString()}</p>
                <a href={sismo.url_usgs} target="_blank" rel="noopener noreferrer">Más detalles en USGS</a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapPage;