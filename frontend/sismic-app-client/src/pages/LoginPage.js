// Página de inicio de sesión con validación, animación y modal de inactividad
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form"; // Manejo de formularios
import { yupResolver } from "@hookform/resolvers/yup"; // Integración Yup con react-hook-form
import * as yup from "yup"; // Validación de esquemas
import { useNavigate, Link, useLocation } from "react-router-dom"; // Navegación y enlaces
import toast, { Toaster } from "react-hot-toast"; // Notificaciones

// Importaciones de MUI (componentes de UI y modal)
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
} from "@mui/material";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled"; // Icono para el modal

import { motion } from "framer-motion"; // Animaciones
import { jwtDecode } from "jwt-decode"; // Decodificar JWT

import { loginUser } from "../api/auth"; // Lógica de login API
import useAuthStore from "../store/authStore"; // Estado global de autenticación



// Esquema de validación para el formulario de login
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Debe ser un correo válido")
    .required("El correo es obligatorio"),
  password: yup.string().required("La contraseña es obligatoria"),
});

// Componente Box animado usando Framer Motion
const MotionBox = motion(Box);

const LoginPage = () => {
  // Hook de navegación para redirigir y leer el estado de la ruta
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore(); // Acción global para guardar el login

  // Hook de react-hook-form para manejar el formulario y validación
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Estado para mostrar el modal de inactividad si la razón está en la ruta
  const [showInactivityModal, setShowInactivityModal] = useState(false);

  // Efecto: Si la razón es inactividad, muestra el modal y limpia el estado de la ruta
  useEffect(() => {
    if (location.state?.reason === "inactivity") {
      setShowInactivityModal(true);
      // Limpiamos el estado de la ruta inmediatamente para evitar que se muestre el modal múltiples veces
      navigate(location.pathname, { replace: true });
    }
  }, [location.state?.reason, navigate, location.pathname]);

  // Cierra el modal de inactividad
  const handleCloseModal = () => {
    setShowInactivityModal(false);
    // Aseguramos que el estado de la ruta esté limpio
    if (location.state?.reason === "inactivity") {
      navigate(location.pathname, { replace: true });
    }
  };

  // Lógica de envío del formulario de login
  const onSubmit = async (data) => {
    try {
      // Llama a la API para autenticar
      const tokens = await loginUser(data);
      // Decodifica el token para obtener el nombre
      const decodedToken = jwtDecode(tokens.access);
      // Guarda el estado global de autenticación
      login(tokens);
      // Notificación de éxito
      toast.success(`¡Bienvenido de nuevo, ${decodedToken.first_name}!`);
      // Redirige al mapa
      navigate("/mapa");
    } catch (error) {
      toast.error("Correo o contraseña incorrectos.");
    }
  };

  // Variantes de animación para el formulario
  const formVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 // Empieza 20px más abajo de su posición final
    },
    visible: { 
      opacity: 1, 
      y: 0,   // Vuelve a su posición original
      transition: { 
        duration: 0.5, // La animación dura medio segundo
        ease: "easeInOut" // Un efecto de suavizado para que no se vea robótico
      } 
    },
  };

  return (
    <>
      {/* Contenedor principal del login */}
      <Container component="main" maxWidth="xs">
        <Toaster position="top-center" />
        {/* Formulario animado con variantes */}
        <MotionBox
          variants={formVariants}
          initial="hidden"
          animate="visible"
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "background.paper",
            padding: { xs: 2, sm: 4 },
            borderRadius: "1rem",
            boxShadow: 3,
          }}
        >
          <Typography component="h1" variant="h5">
            Iniciar Sesión
          </Typography>
          {/* Formulario de login */}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              label="Correo Electrónico"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            {/* Botón animado */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Ingresar"
                )}
              </Button>
            </motion.div>
            <Typography variant="body2" align="center">
              ¿No tienes una cuenta?{" "}
              <Link
                to="/registro"
                style={{ color: "#2196f3", textDecoration: "none" }}
              >
                Regístrate aquí
              </Link>
            </Typography>
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              <Link to="/olvide-mi-password" style={{ color: '#1976d2', textDecoration: "none" }}>
                ¿Olvidaste tu contraseña?
              </Link>
            </Typography>
          </Box>
        </MotionBox>
      </Container>

      {/* Modal para sesión finalizada por inactividad */}
      <Dialog
        open={showInactivityModal}
        onClose={handleCloseModal}
        TransitionComponent={Fade}
        transitionDuration={10}
        PaperProps={{
          sx: {
            borderRadius: "1rem",
            padding: "1rem",
          },
        }}
      >
        {/* Título del modal con icono */}
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <AccessTimeFilledIcon color="primary" fontSize="large" />
          <Typography variant="h6" component="div" fontWeight="bold">
            Sesión Finalizada por Inactividad
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Para proteger tu cuenta, hemos cerrado tu sesión automáticamente
            después de 20 minutos sin actividad. Por favor, inicia sesión de
            nuevo para continuar.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} variant="contained" autoFocus>
            Entendido
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LoginPage;
