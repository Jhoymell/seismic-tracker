import React, { useState, useEffect } from 'react';
import { getNoticias, createNoticia, updateNoticia, deleteNoticia } from '../../api/news';
import toast from 'react-hot-toast';
import NewsForm from './NewsForm'; // Importaremos el formulario

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null); // null para crear, objeto para editar

  const fetchNews = async () => {
    try {
      const data = await getNoticias();
      setNews(data);
    } catch (error) {
      toast.error("No se pudieron cargar las noticias.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleCreate = () => {
    setEditingNews(null);
    setIsModalOpen(true);
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setIsModalOpen(true);
  };

  const handleDelete = async (newsId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
      try {
        await deleteNoticia(newsId);
        toast.success('Noticia eliminada.');
        fetchNews();
      } catch (error) {
        toast.error('No se pudo eliminar la noticia.');
      }
    }
  };

  const handleFormSubmit = async (data) => {
    const isEditing = !!editingNews;
    const apiCall = isEditing ? updateNoticia(editingNews.id, data) : createNoticia(data);

    try {
      await apiCall;
      toast.success(`Noticia ${isEditing ? 'actualizada' : 'creada'} con éxito.`);
      setIsModalOpen(false);
      fetchNews();
    } catch (error) {
      toast.error("Ocurrió un error al guardar la noticia.");
    }
  };

  if (loading) return <p>Cargando noticias...</p>;

  return (
    <div>
      <h3>Gestionar Noticias</h3>
      <button onClick={handleCreate} className="create-btn">Crear Nueva Noticia</button>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Fecha de Publicación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {news.map(item => (
            <tr key={item.id}>
              <td>{item.titulo}</td>
              <td>{new Date(item.fecha_publicacion).toLocaleString()}</td>
              <td>
                <button onClick={() => handleEdit(item)} className="action-btn edit-btn">Editar</button>
                <button onClick={() => handleDelete(item.id)} className="action-btn delete-btn">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <NewsForm
          initialData={editingNews}
          onSubmit={handleFormSubmit}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default NewsManagement;