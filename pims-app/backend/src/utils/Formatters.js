/**
 * Utilidades de formateo para el backend
 * Requerido para generación de PDFs y respuestas de API
 */

/**
 * Formatea un número como moneda
 * @param {number} value - Valor a formatear
 * @param {string} currency - Código de moneda (default: USD)
 * @returns {string} - Valor formateado
 */
const formatCurrency = (value, currency = 'USD') => {
  if (value === null || value === undefined) return '$0.00';
  
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(parseFloat(value));
};

/**
 * Formatea un número con separadores de miles
 * @param {number} value - Valor a formatear
 * @returns {string} - Número formateado
 */
const formatNumber = (value) => {
  if (value === null || value === undefined) return '0';
  
  return new Intl.NumberFormat('es-ES').format(value);
};

/**
 * Formatea una fecha en formato legible
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} - Fecha formateada
 */
const formatDate = (date) => {
  if (!date) return '';
  
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

/**
 * Formatea un porcentaje
 * @param {number} value - Valor decimal
 * @param {number} decimals - Decimales a mostrar
 * @returns {string} - Porcentaje formateado
 */
const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined) return '0%';
  
  return `${parseFloat(value).toFixed(decimals)}%`;
};

/**
 * Calcula y formatea el margen de ganancia
 * @param {number} costo - Precio de compra
 * @param {number} venta - Precio de venta
 * @returns {object} - Margen en valor y porcentaje
 */
const calculateMargin = (costo, venta) => {
  const costoNum = parseFloat(costo);
  const ventaNum = parseFloat(venta);
  
  if (costoNum === 0) return { value: 0, percentage: '0%' };
  
  const marginValue = ventaNum - costoNum;
  const marginPercentage = (marginValue / costoNum) * 100;
  
  return {
    value: formatCurrency(marginValue),
    percentage: formatPercentage(marginPercentage)
  };
};

module.exports = {
  formatCurrency,
  formatNumber,
  formatDate,
  formatPercentage,
  calculateMargin
};