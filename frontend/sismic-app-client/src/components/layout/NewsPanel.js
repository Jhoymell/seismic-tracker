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
import { motion, AnimatePresence } from "framer-motion";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// Versiones animadas de los componentes de MUI
const MotionList = motion(List);
const MotionListItem = motion(ListItem);

const NewsPanel = () => {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toggleNewsPanel } = useAuthStore();
  const [selectedNews, setSelectedNews] = useState(null);

  const handleReadMore = (newsItem) => setSelectedNews(newsItem);
  const handleCloseModal = () => setSelectedNews(null);

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

  const TRUNCATE_LENGTH = 120;

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);
  useInterval(fetchNews, 30000);

  // Variantes de animación (panel contenedor + lista)
  const panelVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
    exit: { opacity: 0, y: 16, transition: { duration: 0.7, ease: "easeIn" } },
  };

  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
        duration: 0.7,
      },
    },
  };

  const listItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, duration: 0.7 },
    },
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key="news-panel"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={panelVariants}
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              background: "linear-gradient(135deg, #0a121e 80%, #10131a 100%)",
              color: "#b3e5fc",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                variant="h6"
                component="h2"
                sx={{
                  m: 0,
                  background:
                    "linear-gradient(90deg, #2196f3, #00bcd4, #00e5ff, #2196f3)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 2px 12px #00e5ff33)",
                  letterSpacing: "-0.3px",
                  fontWeight: 800,
                }}
              >
                Noticias Recientes
              </Typography>
              <Tooltip title="Ocultar Panel de Noticias">
                <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.92 }}>
                  <IconButton onClick={toggleNewsPanel} sx={{ color: "#e3f7fa" }}>
                    <ChevronRightIcon />
                  </IconButton>
                </motion.div>
              </Tooltip>
            </Box>

            <Divider sx={{ borderColor: "rgba(0,188,212,0.25)", mb: 1 }} />

            <MotionList
              sx={{ overflowY: "auto", flexGrow: 1, p: 0 }}
              variants={listContainerVariants}
              initial="hidden"
              animate="visible"
              layout
            >
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <CircularProgress />
                </Box>
              ) : noticias.length > 0 ? (
                noticias.map((noticia, index) => (
                  <React.Fragment key={noticia.id}>
                    <MotionListItem
                      variants={listItemVariants}
                      alignItems="flex-start"
                      sx={{
                        flexDirection: "column",
                        borderRadius: "12px",
                        mx: 1,
                        px: 1.5,
                        py: 1,
                        transition:
                          "background-color .25s ease, box-shadow .25s ease, transform .2s ease",
                      }}
                      whileHover={{
                        scale: 1.03,
                        y: -2,
                        boxShadow: "0 10px 26px rgba(0,188,212,0.18)",
                        backgroundColor: "rgba(0,188,212,0.06)",
                      }}
                      whileTap={{ scale: 0.995 }}
                      transition={{ duration: 0.25 }}
                      layout
                    >
                      <ListItemText
                        primary={
                          <Typography
                            variant="subtitle1"
                            sx={{ color: "#e3f7fa", fontWeight: 700 }}
                          >
                            {noticia.titulo}
                          </Typography>
                        }
                        secondary={
                          <div
                            className="news-content"
                            style={{ color: "#b3e5fc" }}
                            dangerouslySetInnerHTML={{
                              __html:
                                noticia.contenido.substring(0, TRUNCATE_LENGTH) +
                                (noticia.contenido.length > TRUNCATE_LENGTH
                                  ? "..."
                                  : ""),
                            }}
                          />
                        }
                        secondaryTypographyProps={{ component: "div" }}
                      />
                      {noticia.contenido.length > TRUNCATE_LENGTH && (
                        <Button
                          size="small"
                          onClick={() => handleReadMore(noticia)}
                          sx={{
                            alignSelf: "flex-end",
                            color: "#00bcd4",
                            textTransform: "none",
                            "&:hover": {
                              color: "#2196f3",
                              background: "transparent",
                              textDecoration: "underline",
                            },
                          }}
                        >
                          Ver más...
                        </Button>
                      )}
                    </MotionListItem>
                    {index < noticias.length - 1 && (
                      <Divider component="li" sx={{ borderColor: "#0e2a36" }} />
                    )}
                  </React.Fragment>
                ))
              ) : (
                <Typography sx={{ p: 2, color: "text.secondary" }}>
                  No hay noticias disponibles.
                </Typography>
              )}
            </MotionList>
          </Box>
        </motion.div>
      </AnimatePresence>

      <Dialog
        open={!!selectedNews}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="md"
        TransitionComponent={Fade}
        transitionDuration={700} // duración a 0.7s
      >
        {selectedNews && (
          <>
            <DialogTitle
              variant="h4"
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
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, mb: 2, display: "block" }}
              >
                Publicado el:{" "}
                {new Date(selectedNews.fecha_publicacion).toLocaleDateString(
                  "es-CR",
                  { year: "numeric", month: "long", day: "numeric" }
                )}
              </Typography>

              <Box
                className="news-content-full"
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
