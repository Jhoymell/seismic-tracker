import React, { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getNoticias } from '../../api/news';
import useInterval from '../../hooks/useInterval'; // <-- Importamos nuestro nuevo hook
import './NewsPanel.css';

// NewsPanel: Componente lateral que muestra las noticias recientes y realiza polling automático
const NewsPanel = () => {
  // Estado para almacenar las noticias
  const [noticias, setNoticias] = useState([]);
  // Estado para mostrar indicador de carga
  const [loading, setLoading] = useState(true);
  // Ref para guardar la fecha de la noticia más reciente
  const latestNewsTimestamp = useRef(null);

  // Función para cargar las noticias iniciales al montar el componente
  const fetchInitialNews = useCallback(async () => {
    setLoading(true);
    try {
      // Trae todas las noticias y muestra solo las 10 más recientes
      const data = await getNoticias();
      setNoticias(data.slice(0, 10));
      if (data.length > 0) {
        // Guarda la fecha de la noticia más reciente para el polling
        latestNewsTimestamp.current = data[0].fecha_publicacion;
      }
    } catch (error) {
      console.error("Error al cargar noticias iniciales:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect para cargar las noticias al montar el componente
  useEffect(() => {
    fetchInitialNews();
  }, [fetchInitialNews]);

  // Polling automático usando el custom hook useInterval
  useInterval(async () => {
    // Si no hay timestamp, no hace polling
    if (!latestNewsTimestamp.current) return;

    console.log(`[NewsPanel] Ejecutando poll de noticias a las ${new Date().toLocaleTimeString()}`);

    try {
      // Pide solo noticias publicadas después de la última conocida
      const params = {
        published_after: latestNewsTimestamp.current,
        _cacheBust: Date.now(), // Evita caché
      };
      const nuevasNoticias = await getNoticias(params);

      if (nuevasNoticias.length > 0) {
        // Notifica al usuario si hay nuevas noticias
        toast.success(`${nuevasNoticias.length} nueva(s) noticia(s) publicada(s)!`);
        setNoticias(prevNoticias => {
          // Combina las nuevas con las anteriores, evitando duplicados por id
          const combined = [...nuevasNoticias, ...prevNoticias];
          const uniqueNews = Array.from(new Set(combined.map(a => a.id)))
                               .map(id => combined.find(a => a.id === id));
          return uniqueNews.slice(0, 10); // Solo las 10 más recientes
        });
        // Actualiza el timestamp para el siguiente polling
        latestNewsTimestamp.current = nuevasNoticias[0].fecha_publicacion;
      }
    } catch (error) {
      console.error("Error durante el polling de noticias:", error);
    }
  }, 30000); // Ejecuta cada 30 segundos

  return (
    // Panel lateral de noticias
    <aside className="news-panel">
      <h2>Noticias Recientes</h2>
      <div className="news-list">
        {loading ? (
          <p>Cargando noticias...</p>
        ) : noticias.length > 0 ? (
          noticias.map(noticia => (
            <div key={noticia.id} className="news-item">
              {/* Título de la noticia */}
              <h4>{noticia.titulo}</h4>
              {/* Muestra solo los primeros 100 caracteres del contenido */}
              <p>{noticia.contenido.substring(0, 100)}...</p>
              {/* Fecha de publicación formateada */}
              <span className="news-date">
                {new Date(noticia.fecha_publicacion).toLocaleDateString()}
              </span>
            </div>
          ))
        ) : (
          <p>No hay noticias disponibles.</p>
        )}
      </div>
    </aside>
  );
};

export default NewsPanel;