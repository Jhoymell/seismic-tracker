import React from "react";
import { Typography, IconButton, Box, Tooltip } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NewspaperIcon from "@mui/icons-material/Newspaper"; // Importamos un nuevo icono
import useAuthStore from "../../store/authStore";

const Header = () => {
  // Obtenemos los estados y acciones que necesitamos del store
  const { openSidebar, isNewsPanelVisible, toggleNewsPanel, isAuthenticated } =
    useAuthStore();

  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        height: "64px",
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Tooltip title="Abrir Menú">
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onMouseEnter={openSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
      </Tooltip>

      <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
        Proyecto Sismológico
      </Typography>

      {isAuthenticated && !isNewsPanelVisible && (
        <Tooltip title="Mostrar Panel de Noticias">
          <IconButton
            color="inherit"
            aria-label="show news panel"
            onClick={toggleNewsPanel}
          >
            <NewspaperIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default Header;
