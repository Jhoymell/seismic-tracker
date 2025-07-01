import React from "react";
import "./MapFilters.css";

const MapFilters = ({ filters, setFilters }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div className="filters-container">
      <div className="filter-group">
        <label htmlFor="magnitud__gte">
          Magnitud Mínima: {filters.magnitud__gte}
        </label>
        <input
          type="range"
          id="magnitud__gte"
          name="magnitud__gte"
          min="4.5"
          max="9.0"
          step="0.1"
          value={filters.magnitud__gte}
          onChange={handleInputChange}
        />
      </div>
      <div className="filter-group">
        <label htmlFor="search">Buscar por Lugar:</label>
        <input
          type="text"
          id="search"
          name="search"
          placeholder="Ej: Chile, Japan, California..."
          value={filters.search}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default MapFilters;
