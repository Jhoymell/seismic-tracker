import apiClient from './apiClient';

// Obtiene los datos del perfil del usuario logueado
export const getProfile = async () => {
  const response = await apiClient.get('/perfil/');
  return response.data;
};

// Actualiza los datos del perfil. Usa FormData para la foto.
export const updateProfile = async (profileData) => {
  // Para enviar archivos, debemos usar FormData
  const formData = new FormData();

  // Añadimos cada campo al objeto FormData
  // Omitimos los campos vacíos para no enviar datos innecesarios (ej: contraseña)
  Object.keys(profileData).forEach(key => {
    if (profileData[key]) {
      formData.append(key, profileData[key]);
    }
  });

  const response = await apiClient.patch('/perfil/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getVisitorUsers = async () => {
    const response = await apiClient.get('/admin/users/');
    return response.data;
};

export const deleteUser = async (userId) => {
    await apiClient.delete(`/admin/users/${userId}/`);
};

export const changePassword = async (passwordData) => {
    const response = await apiClient.post('/perfil/cambiar-password/', passwordData);
    return response.data;
};