// ========================================
// COMPONENTE: ProfilePage
// PROPÓSITO: Página de gestión del perfil de usuario con edición de datos personales
// ========================================

import PageTransition from '../components/utils/PageTransition'; // Transiciones de página
import React, { useState, useEffect } from "react";

// Importaciones para manejo de formularios
import { useForm, Controller } from "react-hook-form"; // Control avanzado de formularios
import { yupResolver } from "@hookform/resolvers/yup"; // Integración con Yup
import * as yup from "yup"; // Validación de esquemas

import toast, { Toaster } from "react-hot-toast"; // Sistema de notificaciones
import PhoneInput from "react-phone-number-input"; // Componente para números telefónicos

// Importaciones de Material-UI
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  CircularProgress,
  Grid,
  InputAdornment, // Para iconos dentro de inputs
  Avatar,
  Paper,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Icono de éxito
import ErrorIcon from "@mui/icons-material/Error"; // Icono de error
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// Importaciones locales
import { getProfile, updateProfile } from "../api/user"; // API de gestión de usuario
import useAuthStore from "../store/authStore"; // Estado global de autenticación
import PasswordChangeModal from "../components/profile/PasswordChangeModal"; // Modal para cambio de contraseña
import { commonStyles } from '../styles/commonStyles'; // Estilos comunes

const BACKEND_URL = 'http://127.0.0.1:8000'; // URL base del backend

// ========================================
// ESQUEMA DE VALIDACIÓN
// ========================================

/**
 * Esquema de validación con Yup para el formulario de perfil
 * Define las reglas de validación para cada campo
 */
const profileSchema = yup.object().shape({
  first_name: yup.string().required("El nombre es obligatorio"),
  last_name: yup.string().required("Los apellidos son obligatorios"),
  telefono: yup
    .string()
    .min(8, "El teléfono parece demasiado corto")
    .required("El teléfono es obligatorio"),
});

// ========================================
// COMPONENTE PRINCIPAL: ProfilePage
// ========================================

/**
 * COMPONENTE PRINCIPAL: ProfilePage
 * 
 * Funcionalidades principales:
 * 1. Carga y muestra los datos actuales del perfil
 * 2. Permite editar información personal (nombre, apellidos, teléfono)
 * 3. Gestión de foto de perfil con vista previa
 * 4. Validación en tiempo real con indicadores visuales
 * 5. Modal para cambio de contraseña
 * 6. Control de cambios pendientes
 */
const ProfilePage = () => {
  // ========================================
  // ESTADO DEL COMPONENTE
  // ========================================
  
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false); // Control del modal de contraseña
  const { user, updateUserProfile } = useAuthStore(); // Estado y funciones del store
  const [previewImage, setPreviewImage] = useState(null); // Vista previa de imagen seleccionada
  const [isLoading, setIsLoading] = useState(true); // Estado de carga inicial

  // ========================================
  // CONFIGURACIÓN DEL FORMULARIO
  // ========================================
  
  /**
   * Configuración del formulario con react-hook-form
   * Incluye validación, modo de validación y valores por defecto
   */
  const {
    control, // Control de campos
    handleSubmit, // Función de envío
    formState: { errors, isSubmitting, touchedFields, isDirty }, // Estados del formulario
    reset, // Función para resetear el formulario
  } = useForm({
    resolver: yupResolver(profileSchema), // Usa el esquema de validación
    mode: "onChange", // Valida en cada cambio
    defaultValues: {
      first_name: "",
      last_name: "",
      telefono: "",
      ruta_fotografia: null,
    },
  });

  // ========================================
  // EFECTO PARA CARGA INICIAL DEL PERFIL
  // ========================================
  
  /**
   * Efecto para cargar los datos del perfil al montar el componente
   * Obtiene la información del usuario desde la API y llena el formulario
   */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        
        // Obtiene los datos del perfil desde la API
        const profileData = await getProfile();
        
        // Rellena el formulario con los datos obtenidos
        reset({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          telefono: profileData.telefono,
          ruta_fotografia: null, // La foto no se pre-carga en el input file
        }, { keepDirty: false }); // Marca el formulario como limpio
        
        // Establece la imagen de vista previa
        setPreviewImage(profileData.ruta_fotografia_url || profileData.ruta_fotografia || null);
        
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        toast.error("No se pudo cargar tu perfil.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, [reset]);

  // ========================================
  // FUNCIÓN DE ENVÍO DEL FORMULARIO
  // ========================================
  
  /**
   * Maneja el envío del formulario de actualización de perfil
   * Utiliza FormData para manejar la subida de archivos
   * @param {Object} data - Datos del formulario
   */
  const onSubmit = async (data) => {
    const loadingToast = toast.loading("Actualizando perfil..."); // Notificación de carga
    
    // Crear FormData para enviar archivos y datos
    const formData = new FormData();
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("telefono", data.telefono);
    
    // Agregar la foto solo si se seleccionó una nueva
    if (data.ruta_fotografia && data.ruta_fotografia.length > 0) {
      formData.append("ruta_fotografia", data.ruta_fotografia[0]);
    }
    
    try {
      // Envía los datos actualizados al backend
      const updatedUser = await updateProfile(formData);
      
      toast.success("Perfil actualizado correctamente.", { id: loadingToast });
      
      // Actualiza el estado global con los nuevos datos
      updateUserProfile({
        ...updatedUser,
        ruta_fotografia: updatedUser.ruta_fotografia_url || updatedUser.ruta_fotografia,
      });
      
      // Resetea el formulario con los nuevos datos (marca como limpio)
      reset({
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        telefono: updatedUser.telefono,
        ruta_fotografia: null, // No pre-cargar el input file
      }, { keepDirty: false });
      
      // Actualiza la vista previa de la imagen
      setPreviewImage(updatedUser.ruta_fotografia_url || updatedUser.ruta_fotografia || null);
      
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      toast.error("Hubo un error al actualizar tu perfil.", { id: loadingToast });
    }
  };

  // ========================================
  // FUNCIONES AUXILIARES PARA VALIDACIÓN VISUAL
  // ========================================
  
  /**
   * Función que devuelve el icono adecuado según el estado de validación del campo
   * @param {string} fieldName - Nombre del campo a validar
   * @returns {JSX.Element|null} - Componente de icono o null
   */
  const getAdornment = (fieldName) => {
    // Si el campo está tocado y no tiene errores, muestra check verde
    if (touchedFields[fieldName] && !errors[fieldName]) {
      return (
        <InputAdornment position="end">
          <CheckCircleIcon color="success" />
        </InputAdornment>
      );
    }
    
    // Si el campo tiene errores, muestra icono de error rojo
    if (errors[fieldName]) {
      return (
        <InputAdornment position="end">
          <ErrorIcon color="error" />
        </InputAdornment>
      );
    }
    
    // Si no hay estado especial, no muestra icono
    return null;
  };

  /**
   * Función que devuelve estilos dinámicos según el estado de validación
   * @param {string} fieldName - Nombre del campo
   * @returns {Object} - Objeto de estilos SX
   */
  const getFieldSx = (fieldName) => ({
    // Si el campo está tocado y es válido, aplica estilos de éxito
    ...(touchedFields[fieldName] &&
      !errors[fieldName] && {
        "& .MuiOutlinedInput-root": {
          "&.Mui-focused fieldset, & fieldset, &:hover fieldset": {
            borderColor: "success.main", // Borde verde
          },
        },
        "& label.Mui-focused": { color: "success.main" }, // Label verde
      }),
  });

  // ========================================
  // LIMPIEZA DE RECURSOS
  // ========================================
  
  /**
   * Efecto para limpiar URLs de objetos blob al desmontar el componente
   * Evita memory leaks de las vistas previas de imágenes
   */



  useEffect(() => {
    // Cleanup: liberar URLs de objetos blob para evitar memory leaks
    return () => {
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  // ========================================
  // RENDERIZADO DEL COMPONENTE
  // ========================================

  return (
    <PageTransition>
      <Container component="main" maxWidth="md">
        {/* Sistema de notificaciones toast */}
        <Toaster position="top-center" />
        
        {/* ========================================
            ESTADO DE CARGA INICIAL
        ======================================== */}
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              ...commonStyles.formContainer,
              marginTop: 4,
              maxWidth: 'none',
              width: '100%',
            }}
          >
            {/* Icono de encabezado */}
            <Box sx={commonStyles.iconContainer}>
              <AccountCircleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            </Box>

            {/* Título de la página */}
            <Typography
              component="h1"
              variant="h5"
              sx={{
                ...commonStyles.pageTitle,
                mb: 2,
              }}
            >
              Mi Perfil
            </Typography>

            <Typography 
              variant="body2" 
              color="text.secondary" 
              align="center" 
              sx={{ 
                mb: 4,
                color: 'rgba(33, 150, 243, 0.7)',
                fontWeight: 500
              }}
            >
              Actualiza tu información personal y foto de perfil
            </Typography>
            
            {/* ========================================
                FORMULARIO DE EDICIÓN DE PERFIL
            ======================================== */}
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 1, width: "100%" }}
            >
              <Grid container spacing={2}>
                
                {/* ========================================
                    CAMPO DE NOMBRE
                ======================================== */}
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="first_name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Nombre"
                        error={!!errors.first_name} // Muestra error si existe
                        helperText={errors.first_name?.message} // Mensaje de error
                        sx={{
                          ...commonStyles.formField,
                          ...getFieldSx("first_name")
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon sx={{ color: 'primary.main' }} />
                            </InputAdornment>
                          ),
                          endAdornment: getAdornment("first_name"), // Icono de validación
                        }}
                      />
                    )}
                  />
                </Grid>
                
                {/* ========================================
                    CAMPO DE APELLIDOS
                ======================================== */}
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="last_name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Apellidos"
                        error={!!errors.last_name}
                        helperText={errors.last_name?.message}
                        sx={{
                          ...commonStyles.formField,
                          ...getFieldSx("last_name")
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon sx={{ color: 'primary.main' }} />
                            </InputAdornment>
                          ),
                          endAdornment: getAdornment("last_name"),
                        }}
                      />
                    )}
                  />
                </Grid>
                
                {/* ========================================
                    CAMPO DE TELÉFONO
                ======================================== */}
                <Grid item xs={12}>
                  <Controller
                    name="telefono"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Número de Teléfono"
                        placeholder="+506 8888-8888"
                        error={!!errors.telefono}
                        helperText={errors.telefono?.message || "Incluye el código de país (ej: +506)"}
                        sx={{
                          ...commonStyles.formField,
                          ...getFieldSx("telefono")
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon sx={{ color: 'primary.main' }} />
                            </InputAdornment>
                          ),
                          endAdornment: getAdornment("telefono"),
                        }}
                      />
                    )}
                  />
                </Grid>
                
                {/* ========================================
                    SECCIÓN DE FOTO DE PERFIL
                ======================================== */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                      mt: 3,
                    }}
                  >
                    <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
                      Foto de Perfil
                    </Typography>

                    {/* Vista previa de la foto actual o nueva seleccionada */}
                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: "50%", // Forma circular
                        overflow: "hidden",
                        border: "3px solid",
                        borderColor: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: 'relative',
                        background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(0, 188, 212, 0.15) 100%)',
                      }}
                    >
                      {(previewImage || (user?.ruta_fotografia && user.ruta_fotografia !== '')) ? (
                        <img
                          src={previewImage || `${BACKEND_URL}${user?.ruta_fotografia}`}
                          alt="Foto de perfil"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover", // Mantiene proporción
                          }}
                          onError={(e) => {
                            // Fallback en caso de error de carga
                            console.error("Error loading image:", e);
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <AccountCircleIcon sx={{ fontSize: 80, color: 'primary.main', opacity: 0.7 }} />
                      )}
                    </Box>

                    {/* Control para seleccionar nueva imagen */}
                    <Controller
                      name="ruta_fotografia"
                      control={control}
                      render={({ field: { onChange, value, ...field } }) => (
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<CameraAltIcon />}
                          sx={{
                            borderRadius: '25px',
                            fontWeight: 600,
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            '&:hover': {
                              backgroundColor: 'rgba(33, 150, 243, 0.1)',
                              borderColor: 'primary.dark',
                            },
                          }}
                        >
                          {(previewImage || user?.ruta_fotografia) ? 'Cambiar Foto' : 'Seleccionar Foto'}
                          <input
                            type="file"
                            accept="image/*" // Solo archivos de imagen
                            hidden
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                onChange(e.target.files); // Actualiza el formulario
                                setPreviewImage(URL.createObjectURL(file)); // Crea vista previa
                                field.onBlur(); // Marca el formulario como "dirty"
                              }
                            }}
                          />
                        </Button>
                      )}
                    />
                  </Box>
                </Grid>
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        Cambiar foto de perfil
                      </Typography>
                      <Controller
                        name="ruta_fotografia"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                          <Button
                            variant="outlined"
                            component="label"
                            sx={{ mt: 1 }}
                          >
                            Seleccionar imagen
                            <input
                              type="file"
                              accept="image/*" // Solo archivos de imagen
                              hidden
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  onChange(e.target.files); // Actualiza el formulario
                                  setPreviewImage(URL.createObjectURL(file)); // Crea vista previa
                                  field.onBlur(); // Marca el formulario como "dirty"
                                }
                              }}
                            />
                          </Button>
                        )}
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {/* ========================================
                  BOTÓN DE ENVÍO CON VALIDACIÓN
              ======================================== */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting || !isDirty} // Deshabilitado si no hay cambios
                sx={{
                  mt: 4,
                  mb: 2,
                  py: 1.5,
                  borderRadius: '12px',
                  fontWeight: 700,
                  boxShadow: '0 4px 20px 0 rgba(33,150,243,0.15)',
                  background: 'linear-gradient(90deg, #2196f3, #00bcd4)', // Gradiente azul
                  '&:hover': {
                    background: 'linear-gradient(90deg, #00bcd4, #2196f3)', // Gradiente invertido
                    boxShadow: '0 8px 32px 0 rgba(33,150,243,0.25)',
                  },
                }}
              >
                {isSubmitting ? <CircularProgress size={24} /> : "Guardar Cambios"}
              </Button>
              
              {/* Mensaje informativo cuando no hay cambios pendientes */}
              {!isDirty && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  align="center"
                  sx={{ display: "block", mb: 2 }}
                >
                  No hay cambios pendientes para guardar.
                </Typography>
              )}
            </Box>

            {/* ========================================
                SECCIÓN DE SEGURIDAD
            ======================================== */}
            <Box
              sx={{
                width: "100%",
                mt: 2,
                pt: 2,
                borderTop: 1,
                borderColor: "divider",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 1,
                  color: "#e3f7fa",
                  fontWeight: 700,
                }}
              >
                Seguridad
              </Typography>
              
              {/* Botón para abrir modal de cambio de contraseña */}
              <Button
                variant="outlined"
                onClick={() => setIsPasswordModalOpen(true)}
                sx={{
                  borderRadius: '12px',
                  color: '#00bcd4',
                  borderColor: 'rgba(0,188,212,0.45)',
                  '&:hover': {
                    borderColor: '#2196f3',
                    background: 'rgba(0,188,212,0.08)',
                  },
                }}
              >
                Cambiar Contraseña
              </Button>
            </Box>
          </Box>
        )}
      </Container>

      {/* ========================================
          MODAL DE CAMBIO DE CONTRASEÑA
      ======================================== */}
      <PasswordChangeModal
        open={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </PageTransition>
  );
};

export default ProfilePage;

