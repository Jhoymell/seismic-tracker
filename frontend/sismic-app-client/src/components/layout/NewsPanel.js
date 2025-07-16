import React, { useState, useEffect, useCallback } from 'react';
import { getNoticias } from '../../api/news';
import useInterval from '../../hooks/useInterval'; // Usamos nuestro hook robusto
import './NewsPanel.css';


// NewsPanel: Componente lateral que muestra las noticias recientes y realiza polling automático
const NewsPanel = () => {
  // Estado para almacenar las noticias
  const [noticias, setNoticias] = useState([]);
  // Estado para mostrar indicador de carga
  const [loading, setLoading] = useState(true);

  // Usamos useCallback para optimizar la función de fetch
  const fetchNews = useCallback(async () => {
    try {
      const data = await getNoticias();
      setNoticias(data.slice(0, 10)); // Muestra hasta 10 noticias
    } catch (error) {
      console.error("Error al cargar noticias:", error);
    } finally {
      if(loading) setLoading(false);
    }
  }, [loading]); // Se vuelve a crear solo si 'loading' cambia

  // Carga inicial
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Polling para nuevas noticias cada 30 segundos
  useInterval(fetchNews, 30000);

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
              {/* Renderiza el contenido HTML enriquecido de la noticia */}
              <div 
                className="news-content"
                dangerouslySetInnerHTML={{ __html: noticia.contenido }} 
              />
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