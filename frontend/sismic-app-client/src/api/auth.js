import axios from 'axios';

// Para producción, la configuraríamos con variables de entorno.
const API_URL = 'http://127.0.0.1:8000/api';

export const registerUser = async (userData) => {
  // El registro de usuarios usualmente no requiere la subida de la foto inmediatamente.
  // La foto se sube en la página de perfil. Por ahora, enviamos los datos textuales.
  // Si el registro requiriera la foto, usaríamos FormData.

  const response = await axios.post(`${API_URL}/registro/`, userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  // Usamos 'email' en lugar de 'username' como pide nuestro backend
  const response = await axios.post(`${API_URL}/token/`, {
      email: credentials.email,
      password: credentials.password,
  });
  return response.data;
};