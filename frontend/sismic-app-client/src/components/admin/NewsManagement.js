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
  Box, // <-- agregado
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { motion } from 'framer-motion';

// Creamos versiones animadas de los componentes de tabla
const MotionTableBody = motion(TableBody);
const MotionTableRow = motion(TableRow);

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

  // Variantes de animación (contenedor y filas)
  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const listItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: '1rem',
        background: 'linear-gradient(135deg, #0a121e 80%, #10131a 100%)',
        boxShadow: '0 2px 16px 0 #00bcd422',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 2,
          background: 'linear-gradient(90deg, #2196f3, #00bcd4, #00e5ff, #2196f3)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: 800,
          letterSpacing: '-0.3px',
          filter: 'drop-shadow(0 2px 12px #00e5ff33)',
        }}
      >
        Gestión de Noticias
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddCircleIcon />}
        onClick={handleCreate}
        sx={{
          mb: 2,
          borderRadius: '12px',
          fontWeight: 700,
          boxShadow: '0 4px 20px 0 rgba(33,150,243,0.15)',
          background: 'linear-gradient(90deg, #2196f3, #00bcd4)',
          '&:hover': {
            background: 'linear-gradient(90deg, #00bcd4, #2196f3)',
            boxShadow: '0 8px 32px 0 rgba(33,150,243,0.25)',
          },
        }}
      >
        Crear Nueva Noticia
      </Button>

      <TableContainer
        component={Paper}
        sx={{
          background: 'rgba(10,18,30,0.65)',
          borderRadius: '1rem',
          boxShadow: '0 2px 16px 0 #00bcd422',
        }}
      >
        <Table
          sx={{
            '& th': {
              color: '#e3f7fa',
              fontWeight: 700,
              borderBottom: '1px solid rgba(0,188,212,0.25)',
            },
            '& td': {
              color: '#b3e5fc',
              borderBottom: '1px solid #0e2a36',
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Fecha de Publicación</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>

          {/* Aplicamos variantes al cuerpo de la tabla */}
          <MotionTableBody
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {news.map((item) => (
              // Cada fila con su propia animación
              <MotionTableRow
                key={item.id}
                variants={listItemVariants}
                whileHover={{
                  scale: 1.01,
                  y: -2,
                  boxShadow: '0 10px 26px rgba(0,188,212,0.18)',
                  backgroundColor: 'rgba(0,188,212,0.06)',
                }}
                transition={{ duration: 0.25 }}
                sx={{ borderRadius: '10px' }}
              >
                <TableCell>{item.titulo}</TableCell>
                <TableCell>
                  {new Date(item.fecha_publicacion).toLocaleString()}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleEdit(item)}
                    color="secondary"
                    sx={{
                      transition: 'transform .15s ease',
                      '&:hover': { transform: 'scale(1.07)' },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(item.id)}
                    color="error"
                    sx={{
                      transition: 'transform .15s ease',
                      '&:hover': { transform: 'scale(1.07)' },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </MotionTableRow>
            ))}
          </MotionTableBody>
        </Table>
      </TableContainer>

      {isModalOpen && (
        <NewsForm
          initialData={editingNews}
          onSubmit={handleFormSubmit}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </Box>
  );
};

export default NewsManagement;
