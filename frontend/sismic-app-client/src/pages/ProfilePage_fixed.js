// ========================================
// COMPONENTE: ProfilePage
// PROPÓSITO: Página de gestión del perfil de usuario con edición de datos personales
// ========================================

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";

// Importaciones de Material-UI
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  CircularProgress,
  Grid,
  InputAdornment,
  Avatar,
  Paper,
  IconButton,
  Card,
  CardContent,
  Divider,
  Alert,
} from "@mui/material";

// Iconos
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';

// Importaciones locales
import { getProfile, updateProfile } from "../api/user";
import useAuthStore from "../store/authStore";
import PasswordChangeModal from "../components/profile/PasswordChangeModal";
import PageTransition from '../components/utils/PageTransition';
import { commonStyles } from '../styles/commonStyles';

const BACKEND_URL = 'http://127.0.0.1:8000';

// ========================================
// ESQUEMA DE VALIDACIÓN
// ========================================

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

const ProfilePage = () => {
  // ========================================
  // ESTADO DEL COMPONENTE
  // ========================================
  
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  const { user, updateUserProfile } = useAuthStore();

  // ========================================
  // CONFIGURACIÓN DEL FORMULARIO
  // ========================================

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty }
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "", 
      telefono: "",
      ruta_fotografia: null,
    }
  });

  // Observar cambios en el formulario
  const watchedFields = watch();

  // ========================================
  // EFECTOS
  // ========================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const profileData = await getProfile();
        
        reset({
          first_name: profileData.first_name || "",
          last_name: profileData.last_name || "",
          telefono: profileData.telefono || "",
          ruta_fotografia: null,
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        toast.error("Error al cargar los datos del perfil");
        setLoading(false);
      }
    };

    loadProfile();
  }, [reset]);

  useEffect(() => {
    setHasChanges(isDirty || previewImage !== null);
  }, [isDirty, previewImage]);

  // ========================================
  // FUNCIONES DEL COMPONENTE
  // ========================================

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      
      // Agregar campos de texto
      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("telefono", data.telefono);
      
      // Agregar imagen si hay una nueva
      if (data.ruta_fotografia && data.ruta_fotografia.length > 0) {
        formData.append("ruta_fotografia", data.ruta_fotografia[0]);
      }

      const updatedProfile = await updateProfile(formData);
      updateUserProfile(updatedProfile);
      
      setPreviewImage(null);
      setHasChanges(false);
      
      toast.success("¡Perfil actualizado correctamente!");
      
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      toast.error("Error al actualizar el perfil");
    }
  };

  const handleImageChange = (onChange) => (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onChange(event.target.files);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // ========================================
  // RENDERIZADO DE LOADING
  // ========================================

  if (loading) {
    return (
      <PageTransition>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress size={60} />
          </Box>
        </Container>
      </PageTransition>
    );
  }

  // ========================================
  // RENDERIZADO PRINCIPAL
  // ========================================

  return (
    <PageTransition>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Toaster position="top-center" />
        
        {/* ========================================
            HEADER DE LA PÁGINA
        ======================================== */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{
              ...commonStyles.pageTitle,
              fontSize: { xs: '1.8rem', md: '2.2rem' },
              mb: 1,
            }}
          >
            Mi Perfil
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestiona tu información personal y configuración de cuenta
          </Typography>
        </Box>

        {/* ========================================
            FORMULARIO DE PERFIL
        ======================================== */}
        <Paper 
          elevation={3}
          sx={{
            ...commonStyles.lightCard,
            overflow: 'hidden',
          }}
        >
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            
            {/* ========================================
                SECCIÓN DE FOTO DE PERFIL
            ======================================== */}
            <Box sx={{ p: 3, textAlign: 'center', backgroundColor: 'rgba(33, 150, 243, 0.02)' }}>
              <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
                Foto de Perfil
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                {/* Avatar/Imagen de perfil */}
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    border: '4px solid',
                    borderColor: 'primary.main',
                    boxShadow: '0 4px 20px rgba(33, 150, 243, 0.3)',
                  }}
                  src={previewImage || (user?.ruta_fotografia ? `${BACKEND_URL}${user.ruta_fotografia}` : undefined)}
                >
                  {!previewImage && !user?.ruta_fotografia && (
                    <AccountCircleIcon sx={{ fontSize: 80 }} />
                  )}
                </Avatar>

                {/* Botón para cambiar imagen */}
                <Controller
                  name="ruta_fotografia"
                  control={control}
                  render={({ field: { onChange, ...field } }) => (
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
                          transform: 'scale(1.02)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {(previewImage || user?.ruta_fotografia) ? 'Cambiar Foto' : 'Seleccionar Foto'}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImageChange(onChange)}
                        {...field}
                      />
                    </Button>
                  )}
                />
              </Box>
            </Box>

            <Divider />

            {/* ========================================
                CAMPOS DEL FORMULARIO
            ======================================== */}
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
                Información Personal
              </Typography>

              <Grid container spacing={3}>
                {/* Campo Nombre */}
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="first_name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Nombre"
                        error={!!errors.first_name}
                        helperText={errors.first_name?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'primary.main',
                            },
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Campo Apellidos */}
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
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'primary.main',
                            },
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Campo Teléfono */}
                <Grid item xs={12}>
                  <Controller
                    name="telefono"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Teléfono"
                        error={!!errors.telefono}
                        helperText={errors.telefono?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'primary.main',
                            },
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Campo Email (solo lectura) */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Correo Electrónico"
                    value={user?.email || ""}
                    disabled
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                    }}
                    helperText="El correo electrónico no se puede modificar"
                  />
                </Grid>
              </Grid>

              {/* ========================================
                  ALERTAS Y BOTONES
              ======================================== */}
              {hasChanges && (
                <Alert 
                  severity="info" 
                  sx={{ 
                    mt: 3, 
                    borderRadius: '12px',
                    '& .MuiAlert-icon': {
                      fontSize: '24px'
                    }
                  }}
                >
                  Tienes cambios sin guardar. No olvides hacer clic en "Guardar Cambios".
                </Alert>
              )}

              <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {/* Botón Guardar */}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || !hasChanges}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                  sx={{
                    ...commonStyles.primaryButton,
                    flex: { xs: '1', sm: 'none' },
                    minWidth: '160px',
                    '&:disabled': {
                      background: 'rgba(0, 0, 0, 0.12)',
                      color: 'rgba(0, 0, 0, 0.26)',
                    },
                  }}
                >
                  {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                </Button>

                {/* Botón Cambiar Contraseña */}
                <Button
                  variant="outlined"
                  startIcon={<LockIcon />}
                  onClick={() => setIsPasswordModalOpen(true)}
                  sx={{
                    borderRadius: '12px',
                    fontWeight: 600,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    flex: { xs: '1', sm: 'none' },
                    minWidth: '160px',
                    '&:hover': {
                      backgroundColor: 'rgba(33, 150, 243, 0.1)',
                      borderColor: 'primary.dark',
                    },
                  }}
                >
                  Cambiar Contraseña
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* ========================================
            MODAL PARA CAMBIO DE CONTRASEÑA
        ======================================== */}
        <PasswordChangeModal
          open={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
        />
      </Container>
    </PageTransition>
  );
};

export default ProfilePage;
