import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import PhoneInput from "react-phone-number-input";
import { motion } from "framer-motion";
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

const profileSchema = yup.object().shape({
  first_name: yup.string().required("El nombre es obligatorio"),
  last_name: yup.string().required("Los apellidos son obligatorios"),
  telefono: yup
    .string()
    .min(8, "El teléfono parece demasiado corto")
    .required("El teléfono es obligatorio"),
});
const MotionBox = motion(Box);

const ProfilePage = () => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const { updateUserProfile } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields, isDirty },
    reset,
    watch,
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

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await getProfile();
        reset(profileData); // Rellena el formulario con los datos cargados
      } catch (error) {
        toast.error("No se pudo cargar tu perfil.");
      }
    };
    loadProfile();
  }, [reset]);

  const onSubmit = async (data) => {
    const loadingToast = toast.loading("Actualizando perfil...");
    try {
      const profileData = { ...data, ruta_fotografia: data.ruta_fotografia[0] };

      const updatedUser = await updateProfile(profileData);
      toast.success("Perfil actualizado correctamente.", { id: loadingToast });

      // Actualizamos el estado global para que el UserHeader cambie al instante
      updateUserProfile({
        first_name: updatedUser.first_name,
        ruta_fotografia: updatedUser.ruta_fotografia,
      });
      reset(updatedUser); // Resetea el formulario con los nuevos datos
    } catch (error) {
      if (error.response && error.response.data) {
        const apiErrors = error.response.data;
        Object.keys(apiErrors).forEach(key => {
          const message = Array.isArray(apiErrors[key]) ? apiErrors[key].join(', ') : apiErrors[key];
          toast.error(`${key}: ${message}`, { id: loadingToast });
        });
      } else {
        toast.error("Hubo un error al actualizar tu perfil.", {
          id: loadingToast,
        });
      }
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

  return (
    <>
      <Container component="main" maxWidth="md">
        <Toaster position="top-center" />
        <Box
          sx={{
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "background.paper",
            padding: { xs: 2, sm: 4 },
            borderRadius: "1rem",
            boxShadow: 3,
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
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
                    <TextField {...field} fullWidth label="Nombre" />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="last_name"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} fullWidth label="Apellidos" />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="telefono"
                  control={control}
                  render={({ field }) => (
                    <PhoneInput
                      {...field}
                      defaultCountry="CR"
                      international
                      className="phone-input-mui"
                      placeholder="Número de teléfono"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
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
                  render={({ field }) => (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting || !isDirty}
              sx={{ mt: 4, mb: 2, py: 1.5 }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} />
              ) : (
                "Guardar Cambios"
              )}
            </Button>
            {/* Mensaje informativo si no hay cambios detectados */}
            {!isDirty && (
              <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block', mb: 2 }}>
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
            <Typography variant="h6" sx={{ mb: 1 }}>
              Seguridad
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setIsPasswordModalOpen(true)}
            >
              Cambiar Contraseña
            </Button>
          </Box>
        </Box>
      </Container>

      {/* El modal ahora usa el prop 'open' para controlar su visibilidad */}
      <PasswordChangeModal
        open={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
};

export default ProfilePage;
