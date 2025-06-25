import React from 'react';
import { Link } from 'react-router-dom';

const LeftNav = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/mapa">Mapa de Sismos</Link></li>
        <li><Link to="/perfil">Mi Perfil</Link></li>
        {/* Agregaremos lógica para mostrar/ocultar links de login/logout/admin */}
      </ul>
    </nav>
  );
};

export default LeftNav;