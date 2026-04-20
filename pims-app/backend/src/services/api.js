import axios from 'axios';
import { message } from 'antd';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Crear instancia de axios
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 segundos
});

// Interceptor de solicitudes
api.interceptors.request.use(
  (config) => {
    // Agregar token de autenticación si existe
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log en desarrollo
    if (import.meta.env.DEV) {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    }
    
    return config;
  },
  (error) => {
    console.error('Error en solicitud:', error);
    return Promise.reject(error);
  }
);

// Interceptor de respuestas
api.interceptors.response.use(
  (response) => {
    // Log en desarrollo
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // Manejo centralizado de errores
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          message.error(data.message || 'Datos inválidos');
          break;
        case 401:
          message.error('Sesión expirada. Por favor, inicie sesión nuevamente.');
          localStorage.removeItem('auth_token');
          // Redirigir a login si es necesario
          window.location.href = '/login';
          break;
        case 403:
          message.error('No tiene permisos para realizar esta acción');
          break;
        case 404:
          message.error(data.message || 'Recurso no encontrado');
          break;
        case 409:
          message.error(data.message || 'Conflicto de datos');
          break;
        case 422:
          if (data.errors) {
            data.errors.forEach(err => message.error(err));
          } else {
            message.error(data.message || 'Error de validación');
          }
          break;
        case 429:
          message.warning('Demasiadas solicitudes. Espere un momento.');
          break;
        case 500:
          message.error('Error interno del servidor. Intente más tarde.');
          break;
        default:
          message.error(data.message || 'Error en la solicitud');
      }
      
      // Log detallado en desarrollo
      if (import.meta.env.DEV) {
        console.error('❌ Error Response:', {
          status,
          url: error.config?.url,
          data,
          headers: error.response.headers
        });
      }
    } else if (error.request) {
      message.error('No se pudo conectar con el servidor');
      
      if (import.meta.env.DEV) {
        console.error('❌ No response received:', error.request);
      }
    } else {
      message.error('Error al procesar la solicitud');
      
      if (import.meta.env.DEV) {
        console.error('❌ Request setup error:', error.message);
      }
    }
    
    return Promise.reject(error);
  }
);

// Funciones helper para operaciones comunes
export const apiHelpers = {
  /**
   * Descargar archivo desde respuesta blob
   */
  downloadFile: (blob, filename) => {
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
  
  /**
   * Construir query string desde objeto
   */
  buildQueryString: (params) => {
    return Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  },
  
  /**
   * Formatear errores de validación
   */
  formatValidationErrors: (errors) => {
    return errors.map(err => `${err.field}: ${err.message}`).join('\n');
  }
};

export default api;