import apiClient from './apiClient';

/**
 * Registra un nuevo usuario.
 * @param {object} userData - Datos del usuario (nombre, email, contraseña, etc.).
 */
export const registerUser = async (userData) => {
  const response = await apiClient.post('/registro/', userData);
  return response.data;
};

/**
 * Inicia sesión de un usuario.
 * @param {object} credentials - Credenciales del usuario (email, password).
 * @returns {Promise<object>} - Promesa que resuelve con los tokens de acceso y refresco.
 */
export const loginUser = async (credentials) => {
  // Usamos el endpoint de simple-jwt para obtener el token
  const response = await apiClient.post('/token/', {
      email: credentials.email,
      password: credentials.password,
  });
  return response.data;
};

/**
 * Solicita un reseteo de contraseña para un email.
 * @param {string} email - El correo del usuario que solicita el reseteo.
 */
export const requestPasswordReset = (email) => {
  return apiClient.post('/password_reset/', { email });
};

/**
 * Confirma el reseteo de contraseña con un token.
 * @param {object} data - Objeto que contiene el token y la nueva contraseña.
 */
export const confirmPasswordReset = (data) => {
  return apiClient.post('/password_reset/confirm/', data);
};