import React from "react";
import { Box, Typography, Slider, TextField, Paper } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// MapFilters: Componente para filtrar los sismos en el mapa
// Permite filtrar por magnitud mínima, búsqueda por lugar y rango de fechas
const MapFilters = ({ filters, setFilters }) => {
  // Manejador para los campos de texto (búsqueda)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Manejador para el slider de magnitud mínima
  const handleSliderChange = (e, newValue) => {
    setFilters((prev) => ({ ...prev, magnitud__gte: newValue }));
  };

  // Manejadores para los DatePicker (rango de fechas)
  const handleStartDateChange = (newValue) => {
    setFilters((prev) => ({ ...prev, selectedDate: newValue }));
  };

  return (
    // Paper: Tarjeta visual para los filtros
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: "1rem",
        background: "linear-gradient(135deg, #0a121e 80%, #10131a 100%)",
        boxShadow: "0 2px 16px 0 #00bcd422",
      }}
    >
      {/* Box: Contenedor flexible para los filtros */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {/* Filtro de Magnitud Mínima */}
        <Box sx={{ width: { xs: "100%", md: 250 } }}>
          <Typography
            gutterBottom
            sx={{ color: "#e3f7fa", fontWeight: 600 }}
          >
            Magnitud Mínima: <strong>{filters.magnitud__gte}</strong>
          </Typography>
          <Slider
            value={
              typeof filters.magnitud__gte === "number"
                ? filters.magnitud__gte
                : 4.5
            }
            onChange={handleSliderChange}
            step={0.1}
            min={4.0}
            max={9.0}
            sx={{
              color: "#00bcd4",
              "& .MuiSlider-thumb": {
                boxShadow: "0 0 0 6px rgba(0,188,212,0.16)",
                "&:hover, &.Mui-focusVisible": {
                  boxShadow: "0 0 0 8px rgba(0,188,212,0.24)",
                },
              },
              "& .MuiSlider-track": { border: "none" },
              "& .MuiSlider-rail": { opacity: 0.3 },
            }}
          />
        </Box>

        {/* Filtro de Búsqueda por Lugar */}
        <TextField
          label="Buscar por Lugar"
          variant="outlined"
          size="small"
          name="search"
          value={filters.search}
          onChange={handleInputChange}
          sx={{
            width: { xs: "100%", md: 250 },
            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#00bcd4",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(0,188,212,0.25)",
            },
            "& label.Mui-focused": { color: "#00bcd4" },
            "& .MuiInputBase-input": { color: "#e3f7fa" },
            "& .MuiInputLabel-root": { color: "#b3e5fc" },
          }}
        />

        <DatePicker
          label="Filtrar por Fecha"
          value={filters.selectedDate}
          onChange={handleStartDateChange}
          slotProps={{
            textField: {
              size: "small",
              variant: "outlined",
              InputProps: {
                sx: { width: { xs: "100%", md: 250 } },
              },
              sx: {
                "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#00bcd4",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0,188,212,0.25)",
                },
                "& label.Mui-focused": { color: "#00bcd4" },
                "& .MuiInputBase-input": { color: "#e3f7fa" },
                "& .MuiInputLabel-root": { color: "#b3e5fc" },
              },
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default MapFilters;
