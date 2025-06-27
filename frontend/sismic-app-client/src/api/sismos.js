import apiClient from './apiClient';

export const getSismos = async (params = {}) => {
  // params nos permitirá añadir filtros más adelante (ej: { magnitud__gte: 5 })
  const response = await apiClient.get('/sismos/', { params });
  return response.data;
};