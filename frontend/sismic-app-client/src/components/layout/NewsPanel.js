import React, { useState, useEffect, useCallback } from "react";
import { getNoticias } from "../../api/news";
import useInterval from "../../hooks/useInterval";
import useAuthStore from "../../store/authStore";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  CircularProgress,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
} from "@mui/material";
import { motion } from "framer-motion";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const NewsPanel = () => {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toggleNewsPanel } = useAuthStore();

  const [selectedNews, setSelectedNews] = useState(null);

  const handleReadMore = (newsItem) => {
    setSelectedNews(newsItem);
  };

  const handleCloseModal = () => {
    setSelectedNews(null);
  };

  const fetchNews = useCallback(async () => {
    try {
      const data = await getNoticias();
      setNoticias(data.slice(0, 10));
    } catch (error) {
      console.error("Error al cargar noticias:", error);
    } finally {
      if (loading) setLoading(false);
    }
  }, [loading]);

  const TRUNCATE_LENGTH = 120; // Longitud máxima del texto truncado

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);
  useInterval(fetchNews, 30000);

  return (
    <>
      <Box
        sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="h6" component="h2">
            Noticias Recientes
          </Typography>
          <Tooltip title="Ocultar Panel de Noticias">
            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
              <IconButton onClick={toggleNewsPanel}>
                <ChevronRightIcon />
              </IconButton>
            </motion.div>
          </Tooltip>
        </Box>
        <Divider />
        <List sx={{ overflowY: "auto", flexGrow: 1, p: 0 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : noticias.length > 0 ? (
            noticias.map((noticia, index) => (
              <React.Fragment key={noticia.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{ flexDirection: "column" }}
                >
                  <ListItemText
                    primary={noticia.titulo}
                    secondary={
                      <div
                        className="news-content"
                        dangerouslySetInnerHTML={{
                          __html:
                            noticia.contenido.substring(0, 150) +
                            (noticia.contenido.length > 150 ? "..." : ""),
                        }}
                      />

                    }
                    secondaryTypographyProps={{ component: 'div' }}
                  />
                  {/* Botón Ver más si el contenido es largo */}
                  {noticia.contenido.length > 120 && (
                    <Button
                      size="small"
                      onClick={() => handleReadMore(noticia)}
                      sx={{ alignSelf: "flex-end" }}
                    >
                      Ver más...
                    </Button>
                  )}
                </ListItem>
                {index < noticias.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))
          ) : (
            <Typography sx={{ p: 2, color: "text.secondary" }}>
              No hay noticias disponibles.
            </Typography>
          )}
        </List>
      </Box>

      {/* Modal para mostrar la noticia completa */}
      <Dialog
        open={!!selectedNews}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="md"
        // Añadimos una transición de desvanecimiento para el modal
        TransitionComponent={Fade}
        transitionDuration={500}
      >
        {selectedNews && (
          <>
            <DialogTitle
              variant="h4" // Hacemos el título más grande
              component="h2"
              sx={{
                fontWeight: "bold",
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              {selectedNews.titulo}
            </DialogTitle>

            <DialogContent>
              {/* --- INICIO DE LA MODIFICACIÓN --- */}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, mb: 2, display: "block" }} // Añadimos espaciado
              >
                Publicado el:{" "}
                {new Date(selectedNews.fecha_publicacion).toLocaleDateString(
                  "es-CR",
                  { year: "numeric", month: "long", day: "numeric" }
                )}
              </Typography>
              {/* --- FIN DE LA MODIFICACIÓN --- */}

              <Box
                className="news-content-full" // Usamos una clase diferente para poder darle estilos únicos
                dangerouslySetInnerHTML={{ __html: selectedNews.contenido }}
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={handleCloseModal} variant="contained">
                Cerrar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default NewsPanel;
