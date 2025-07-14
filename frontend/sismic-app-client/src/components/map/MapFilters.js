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
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
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
          <Typography gutterBottom>
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
          sx={{ width: { xs: "100%", md: 250 } }}
        />

        <DatePicker
          label="Filtrar por Fecha"
          value={filters.selectedDate}
          onChange={handleStartDateChange}
          slotProps={{
            textField: {
              size: "small",
              variant: "outlined",
              // Esto permite que el usuario limpie la fecha
              InputProps: {
                sx: { width: { xs: "100%", md: 250 } },
              },
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default MapFilters;
