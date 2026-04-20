/**
 * Middleware de validación para endpoints de productos
 * Asegura integridad de datos antes de procesar en controladores
 */

const { ApiError } = require('./errorHandler');

/**
 * Validación para creación de producto
 */
const validateProductCreate = (req, res, next) => {
  const {
    sku,
    nombre,
    categoria,
    precio_compra,
    precio_venta,
    stock_actual,
    stock_minimo
  } = req.body;

  const errors = [];

  // Validar SKU
  if (!sku || typeof sku !== 'string' || sku.trim().length === 0) {
    errors.push('SKU es requerido y debe ser texto');
  } else if (sku.length > 50) {
    errors.push('SKU no puede exceder 50 caracteres');
  }

  // Validar nombre
  if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
    errors.push('Nombre es requerido');
  } else if (nombre.length > 200) {
    errors.push('Nombre no puede exceder 200 caracteres');
  }

  // Validar categoría
  if (!categoria || typeof categoria !== 'string' || categoria.trim().length === 0) {
    errors.push('Categoría es requerida');
  }

  // Validar precio compra
  if (precio_compra === undefined || precio_compra === null) {
    errors.push('Precio de compra es requerido');
  } else if (isNaN(parseFloat(precio_compra)) || parseFloat(precio_compra) < 0) {
    errors.push('Precio de compra debe ser un número positivo');
  }

  // Validar precio venta
  if (precio_venta === undefined || precio_venta === null) {
    errors.push('Precio de venta es requerido');
  } else if (isNaN(parseFloat(precio_venta)) || parseFloat(precio_venta) < 0) {
    errors.push('Precio de venta debe ser un número positivo');
  }

  // Validar que precio venta >= precio compra (opcional pero recomendado)
  if (parseFloat(precio_venta) < parseFloat(precio_compra)) {
    errors.push('Precio de venta debe ser mayor o igual al precio de compra');
  }

  // Validar stock actual
  if (stock_actual !== undefined && (isNaN(parseInt(stock_actual)) || parseInt(stock_actual) < 0)) {
    errors.push('Stock actual debe ser un número entero positivo');
  }

  // Validar stock mínimo
  if (stock_minimo !== undefined && (isNaN(parseInt(stock_minimo)) || parseInt(stock_minimo) < 0)) {
    errors.push('Stock mínimo debe ser un número entero positivo');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors
    });
  }

  next();
};

/**
 * Validación para actualización de producto
 */
const validateProductUpdate = (req, res, next) => {
  const {
    sku,
    nombre,
    precio_compra,
    precio_venta,
    stock_actual,
    stock_minimo
  } = req.body;

  const errors = [];

  // Validaciones opcionales (solo si el campo está presente)
  if (sku !== undefined) {
    if (typeof sku !== 'string' || sku.trim().length === 0) {
      errors.push('SKU debe ser texto no vacío');
    } else if (sku.length > 50) {
      errors.push('SKU no puede exceder 50 caracteres');
    }
  }

  if (nombre !== undefined && nombre.length > 200) {
    errors.push('Nombre no puede exceder 200 caracteres');
  }

  if (precio_compra !== undefined) {
    if (isNaN(parseFloat(precio_compra)) || parseFloat(precio_compra) < 0) {
      errors.push('Precio de compra debe ser un número positivo');
    }
  }

  if (precio_venta !== undefined) {
    if (isNaN(parseFloat(precio_venta)) || parseFloat(precio_venta) < 0) {
      errors.push('Precio de venta debe ser un número positivo');
    }
  }

  if (stock_actual !== undefined) {
    if (isNaN(parseInt(stock_actual)) || parseInt(stock_actual) < 0) {
      errors.push('Stock actual debe ser un número entero positivo');
    }
  }

  if (stock_minimo !== undefined) {
    if (isNaN(parseInt(stock_minimo)) || parseInt(stock_minimo) < 0) {
      errors.push('Stock mínimo debe ser un número entero positivo');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors
    });
  }

  next();
};

/**
 * Validación de ID en parámetros
 */
const validateId = (req, res, next) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: 'ID inválido',
      error: 'El ID debe ser un número entero positivo'
    });
  }
  
  next();
};

module.exports = {
  validateProductCreate,
  validateProductUpdate,
  validateId
};