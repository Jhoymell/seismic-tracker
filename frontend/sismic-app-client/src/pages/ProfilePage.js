import PageTransition from '../components/utils/PageTransition';
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import PhoneInput from "react-phone-number-input";
// Importaciones de MUI
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  CircularProgress,
  Grid,
  InputAdornment,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

import { getProfile, updateProfile } from "../api/user";
import useAuthStore from "../store/authStore";
import PasswordChangeModal from "../components/profile/PasswordChangeModal";
import { commonStyles } from '../styles/commonStyles';
const BACKEND_URL = 'http://127.0.0.1:8000';

const profileSchema = yup.object().shape({
  first_name: yup.string().required("El nombre es obligatorio"),
  last_name: yup.string().required("Los apellidos son obligatorios"),
  telefono: yup
    .string()
    .min(8, "El teléfono parece demasiado corto")
    .required("El teléfono es obligatorio"),
});
// const MotionBox = motion(Box); // Eliminado porque no se usa

const ProfilePage = () => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const { user, updateUserProfile } = useAuthStore();
  const [previewImage, setPreviewImage] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields, isDirty },
    reset,
  } = useForm({
    resolver: yupResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      telefono: "",
      ruta_fotografia: null,
    },
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const profileData = await getProfile();
        // Solo rellenar el formulario y la previsualización, NO el estado global
        reset({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          telefono: profileData.telefono,
          ruta_fotografia: null,
        }, { keepDirty: false });
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

  // en src/pages/ProfilePage.js
  const onSubmit = async (data) => {
    const loadingToast = toast.loading("Actualizando perfil...");
    const formData = new FormData();
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("telefono", data.telefono);
    if (data.ruta_fotografia && data.ruta_fotografia.length > 0) {
      formData.append("ruta_fotografia", data.ruta_fotografia[0]);
    }
    try {
      const updatedUser = await updateProfile(formData);
      toast.success("Perfil actualizado correctamente.", { id: loadingToast });
      // Usa la URL absoluta si existe
      updateUserProfile({
        ...updatedUser,
        ruta_fotografia: updatedUser.ruta_fotografia_url || updatedUser.ruta_fotografia,
      });
      reset({
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        telefono: updatedUser.telefono,
        ruta_fotografia: null,
      }, { keepDirty: false });
      setPreviewImage(updatedUser.ruta_fotografia_url || updatedUser.ruta_fotografia || null);
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      toast.error("Hubo un error al actualizar tu perfil.", { id: loadingToast });
    }
  };

  const getAdornment = (fieldName) => {
    if (touchedFields[fieldName] && !errors[fieldName]) {
      return (
        <InputAdornment position="end">
          <CheckCircleIcon color="success" />
        </InputAdornment>
      );
    }
    if (errors[fieldName]) {
      return (
        <InputAdornment position="end">
          <ErrorIcon color="error" />
        </InputAdornment>
      );
    }
    return null;
  };

  const getFieldSx = (fieldName) => ({
    ...(touchedFields[fieldName] &&
      !errors[fieldName] && {
        "& .MuiOutlinedInput-root": {
          "&.Mui-focused fieldset, & fieldset, &:hover fieldset": {
            borderColor: "success.main",
          },
        },
        "& label.Mui-focused": { color: "success.main" },
      }),
  });



  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  return (
    <PageTransition>
      <Container component="main" maxWidth="md">
        <Toaster position="top-center" />
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              ...commonStyles.formContainer,
              marginTop: 4,
            }}
          >
            <Typography
              component="h1"
              variant="h5"
              sx={{
                ...commonStyles.pageTitle,
                mb: 3,
              }}
            >
              Mi Perfil
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 1, width: "100%" }}
            >
              <Grid container spacing={2}>
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
                          endAdornment: getAdornment("first_name"),
                        }}
                        sx={getFieldSx("first_name")}
                      />
                    )}
                  />
                </Grid>
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
                          endAdornment: getAdornment("last_name"),
                        }}
                        sx={getFieldSx("last_name")}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="telefono"
                    control={control}
                    render={({ field }) => (
                      <Box sx={{ position: "relative" }}>
                        <PhoneInput
                          {...field}
                          defaultCountry="CR"
                          international
                          className="phone-input-mui"
                          placeholder="Número de teléfono"
                          error={!!errors.telefono}
                        />
                        {errors.telefono && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{
                              position: "absolute",
                              bottom: -20,
                              left: 14,
                            }}
                          >
                            {errors.telefono.message}
                          </Typography>
                        )}
                        {touchedFields.telefono && !errors.telefono && (
                          <CheckCircleIcon
                            sx={{
                              position: "absolute",
                              right: 12,
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "success.main",
                            }}
                          />
                        )}
                      </Box>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    {/* Vista previa de la foto actual o la nueva seleccionada */}
                    {(previewImage || user?.ruta_fotografia) && (
                      <Box
                        sx={{
                          width: 150,
                          height: 150,
                          borderRadius: "50%",
                          overflow: "hidden",
                          border: "3px solid",
                          borderColor: "primary.main",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={previewImage || user?.ruta_fotografia}
                          alt="Vista previa"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            console.error("Error loading image:", e);
                            e.target.src = `${BACKEND_URL}${user?.ruta_fotografia}`;
                          }}
                        />
                      </Box>
                    )}

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
                              accept="image/*"
                              hidden
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  onChange(e.target.files);
                                  setPreviewImage(URL.createObjectURL(file));
                                  // Marcar el formulario como "dirty"
                                  field.onBlur();
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

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting || !isDirty}
                sx={{
                  mt: 4,
                  mb: 2,
                  py: 1.5,
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
                {isSubmitting ? <CircularProgress size={24} /> : "Guardar Cambios"}
              </Button>
              {/* Mensaje informativo si no hay cambios detectados */}
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

            {/* Sección de Seguridad */}
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

      <PasswordChangeModal
        open={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </PageTransition>
  );
};

export default ProfilePage;

