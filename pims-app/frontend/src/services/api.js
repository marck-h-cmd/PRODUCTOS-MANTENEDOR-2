import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: import.meta.env.VITE_API_TIMEOUT ? parseInt(import.meta.env.VITE_API_TIMEOUT) : 30000,
});

export const productosService = {
  getAll: (params) => api.get('/productos', { params }),
  getById: (id) => api.get(`/productos/${id}`),
  create: (data) => api.post('/productos', data),
  update: (id, data) => api.put(`/productos/${id}`, data),
  delete: (id) => api.delete(`/productos/${id}`),
  getCategorias: () => api.get('/productos/categorias'),
};

export const dashboardService = {
  getKPIs: () => api.get('/dashboard/kpis'),
  getCharts: () => api.get('/dashboard/charts'),
  getReorder: () => api.get('/dashboard/reorder'),
};

export const reportesService = {
  getInventoryPDF: (categoria) => api.get('/reportes/inventory', { 
    params: { categoria },
    responseType: 'blob'
  }),
  getManagementPDF: () => api.get('/reportes/management', { 
    responseType: 'blob'
  }),
};

export default api;
