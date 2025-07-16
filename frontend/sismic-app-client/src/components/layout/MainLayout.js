import React from "react";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import Header from "./Header";
import LeftNav from "./LeftNav";
import NewsPanel from "./NewsPanel";
import Footer from "./Footer";
import UserHeader from "./UserHeader";
import useAuthStore from "../../store/authStore";

// Definimos variantes para la animación del layout
const MotionBox = motion(Box);

const MainLayout = ({ children }) => {
  const { isAuthenticated, isNewsPanelVisible } = useAuthStore();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        // Forzamos a que el layout principal ocupe exactamente el 100% de la altura de la ventana
        height: "100vh",
      }}
    >
      <Header />
      {/* Este Box contendrá las columnas laterales y el contenido principal */}
      <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        <LeftNav />

        {/* Este Box es el área de contenido principal */}
        <Box component="main" sx={{ flexGrow: 1, p: 3, overflowY: "auto" }}>
          {children}
        </Box>

        {/* Este Box es el panel derecho completo */}
        {isAuthenticated && (
          <MotionBox
            component="aside"
            // La animación se aplica sobre el ancho del panel
            animate={{
              width: isNewsPanelVisible ? 280 : 0,
              opacity: isNewsPanelVisible ? 1 : 0,
            }}
            transition={{ type: "tween", duration: 0.3 }}
            sx={{
              borderLeft: "1px solid",
              borderColor: "divider",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden", // Ocultamos el contenido mientras se encoge
              flexShrink: 0, // Evitamos que el panel se encoja por sí solo
            }}
          >
            <UserHeader />
            <NewsPanel />
          </MotionBox>
        )}
      </Box>
      {/* El Footer ahora está fuera del contenedor con scroll, por lo que no se moverá */}
    </Box>
  );
};

export default MainLayout;
