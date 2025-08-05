import React, { useState, useEffect } from "react";
import {
  getNoticias,
  createNoticia,
  updateNoticia,
  deleteNoticia,
} from "../../api/news";
import toast from "react-hot-toast";
import NewsForm from "./NewsForm"; // Importaremos el formulario
//Importaciones de MUI
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";

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
    if (window.confirm("¿Estás seguro de que quieres eliminar esta noticia?")) {
      try {
        await deleteNoticia(newsId);
        toast.success("Noticia eliminada.");
        fetchNews();
      } catch (error) {
        toast.error("No se pudo eliminar la noticia.");
      }
    }
  };

  const handleFormSubmit = async (data) => {
    const isEditing = !!editingNews;
    const apiCall = isEditing
      ? updateNoticia(editingNews.id, data)
      : createNoticia(data);

    try {
      await apiCall;
      toast.success(
        `Noticia ${isEditing ? "actualizada" : "creada"} con éxito.`
      );
      setIsModalOpen(false);
      fetchNews();
    } catch (error) {
      toast.error("Ocurrió un error al guardar la noticia.");
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <div>
      <Button
        variant="contained"
        startIcon={<AddCircleIcon />}
        onClick={handleCreate}
        sx={{ mb: 2 }}
      >
        Crear Nueva Noticia
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Fecha de Publicación</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {news.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.titulo}</TableCell>
                <TableCell>
                  {new Date(item.fecha_publicacion).toLocaleString()}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleEdit(item)}
                    color="secondary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(item.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
