import React, { useState, useEffect } from 'react';
import { getNoticias } from '../../api/news';
import useInterval from '../../hooks/useInterval'; // Usamos nuestro hook robusto
import './NewsPanel.css';
import toast from 'react-hot-toast';

// NewsPanel: Componente lateral que muestra las noticias recientes y realiza polling automático
const NewsPanel = () => {
  // Estado para almacenar las noticias
  const [noticias, setNoticias] = useState([]);
  // Estado para mostrar indicador de carga
  const [loading, setLoading] = useState(true);

  // Función para cargar las noticias
  const fetchNews = async () => {
    try {
      // Trae todas las noticias y muestra solo las 10 más recientes
      const data = await getNoticias();
      setNoticias(data.slice(0, 10));
    } catch (error) {
      console.error("Error al cargar noticias:", error);
    } finally {
      if(loading) setLoading(false);
    }
  };

  // useEffect para cargar las noticias al montar el componente
  useEffect(() => {
    fetchNews();
  }, []);

  // El hook useInterval es más fiable para polling
  useInterval(fetchNews, 30000); // Llama a fetchNews cada 30 segundos

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