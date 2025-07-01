import apiClient from './apiClient';

export const getNoticias = async (params = {}) => { // Asegúrate de que acepte params
  const response = await apiClient.get('/noticias/', { params });
  return response.data;
};

export const createNoticia = async (newsData) => {
  const response = await apiClient.post('/noticias/', newsData);
  return response.data;
};

export const updateNoticia = async (newsId, newsData) => {
  const response = await apiClient.put(`/noticias/${newsId}/`, newsData);
  return response.data;
};

export const deleteNoticia = async (newsId) => {
  await apiClient.delete(`/noticias/${newsId}/`);
};