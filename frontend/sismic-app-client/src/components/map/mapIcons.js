// src/components/map/mapIcons.js
import L from 'leaflet';

// Creamos un nuevo icono usando una URL. 
// Este es el clásico marcador rojo de Leaflet.
export const sismoIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],    // Tamaño del icono
  iconAnchor: [12, 41],   // Punto del icono que corresponde a la coordenada del mapa
  popupAnchor: [1, -34],  // Punto desde donde se abrirá el popup, relativo al iconAnchor
  shadowSize: [41, 41]    // Tamaño de la sombra
});