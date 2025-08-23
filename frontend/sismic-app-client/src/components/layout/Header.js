import React from "react";
import { Typography, IconButton, Box, Tooltip } from "@mui/material";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import useAuthStore from "../../store/authStore";

/**
 * Componente Header - Barra superior de la aplicación
 * 
 * Funcionalidades:
 * - Muestra el título de la aplicación
 * - Botón para mostrar/ocultar panel de noticias (solo para usuarios autenticados)
 * - Se adapta responsivamente
 * 
 * @returns {JSX.Element} Header component
 */
const Header = () => {
  // Obtenemos los estados y acciones que necesitamos del store
  const { isNewsPanelVisible, toggleNewsPanel, isAuthenticated } = useAuthStore();

  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        paddingLeft: "80px", // Dejamos espacio para el botón del sidebar
        height: "64px",
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        position: "relative",
        zIndex: 1000,
      }}
    >
      <Typography 
        variant="h6" 
        component="h1" 
        sx={{ 
          flexGrow: 1,
          fontWeight: 'bold',
          color: 'primary.main'
        }}
      >
        Proyecto Sismológico
      </Typography>

      {isAuthenticated && !isNewsPanelVisible && (
        <Tooltip title="Mostrar Panel de Noticias">
          <IconButton
            color="inherit"
            aria-label="show news panel"
            onClick={toggleNewsPanel}
            sx={{
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white'
              }
            }}
          >
            <NewspaperIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default Header;
