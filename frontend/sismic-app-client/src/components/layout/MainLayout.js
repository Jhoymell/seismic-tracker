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
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Header />
        {/* Este Box contendrá las columnas laterales y el contenido principal */}
        <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
          <LeftNav />

          {/* Este Box es el área de contenido principal */}
          <Box 
            component="main" 
            sx={{ 
              flexGrow: 1, 
              p: 3, 
              overflowY: "auto",
              // Ajuste automático para el sidebar en desktop
              marginLeft: { 
                xs: 0, // Sin margen en móvil (overlay)
                sm: 0, // Sin margen en tablet (overlay)
                md: '72px' // Margen en desktop para el sidebar colapsado
              },
              transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
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
      </Box>
      <Footer />
    </>
  );
};

export default MainLayout;
