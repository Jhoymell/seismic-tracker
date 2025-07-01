import React, { useState, useEffect, useRef } from 'react';
import { getNoticias } from '../../api/news';
import './NewsPanel.css';

const NewsPanel = () => {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  // Usamos useRef para guardar el timestamp de la última noticia sin causar re-renders
  const latestNewsTimestamp = useRef(null);

  useEffect(() => {
    // Función para la carga inicial de noticias
    const fetchInitialNews = async () => {
      try {
        const data = await getNoticias();
        setNoticias(data.slice(0, 10)); // Mostramos hasta 10 noticias
        // Guardamos la fecha de la noticia más reciente si existe
        if (data.length > 0) {
          latestNewsTimestamp.current = data[0].fecha_publicacion;
        }
      } catch (error) {
        console.error("No se pudieron cargar las noticias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialNews();

    // Configuración del Polling
    const interval = setInterval(async () => {
      if (!latestNewsTimestamp.current) return; // No hacer polling si no hay noticias iniciales

      console.log("Buscando nuevas noticias...");
      try {
        const params = { published_after: latestNewsTimestamp.current };
        const nuevasNoticias = await getNoticias(params);

        if (nuevasNoticias.length > 0) {
          console.log(`${nuevasNoticias.length} nueva(s) noticia(s) encontrada(s)!`);
          // Añadir las nuevas noticias al principio de la lista
          setNoticias(prevNoticias => [...nuevasNoticias, ...prevNoticias].slice(0, 10));
          // Actualizar el timestamp de la última noticia
          latestNewsTimestamp.current = nuevasNoticias[0].fecha_publicacion;
        }
      } catch (error) {
        console.error("Error durante el polling de noticias:", error);
      }
    }, 30000); // Polling cada 30 segundos

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez

  return (
    <aside className="news-panel">
      <h2>Noticias Recientes</h2>
      <div className="news-list">
        {loading ? (
          <p>Cargando noticias...</p>
        ) : noticias.length > 0 ? (
          noticias.map(noticia => (
            <div key={noticia.id} className="news-item">
              <h4>{noticia.titulo}</h4>
              <p>{noticia.contenido.substring(0, 100)}...</p>
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