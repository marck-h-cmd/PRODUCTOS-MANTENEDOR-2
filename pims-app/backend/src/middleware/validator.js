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
  } else {
    const trimmedSku = sku.trim();
    if (trimmedSku.length > 50) {
      errors.push('SKU no puede exceder 50 caracteres');
    }
    if (!/^[A-Z0-9-]+$/.test(trimmedSku)) {
      errors.push('SKU solo puede contener letras mayúsculas, números y guiones');
    }
  }

  // Validar nombre
  if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
    errors.push('Nombre es requerido');
  } else {
    const trimmedNombre = nombre.trim();
    if (trimmedNombre.length < 3) {
      errors.push('Nombre debe tener al menos 3 caracteres');
    }
    if (trimmedNombre.length > 200) {
      errors.push('Nombre no puede exceder 200 caracteres');
    }
  }

  // Validar categoría
  if (!categoria || typeof categoria !== 'string' || categoria.trim().length === 0) {
    errors.push('Categoría es requerida');
  }

  // Validar precio compra
  const pCompra = parseFloat(precio_compra);
  if (precio_compra === undefined || precio_compra === null || isNaN(pCompra)) {
    errors.push('Precio de compra es requerido y debe ser un número');
  } else if (pCompra <= 0) {
    errors.push('Precio de compra debe ser mayor a 0');
  }

  // Validar precio venta
  const pVenta = parseFloat(precio_venta);
  if (precio_venta === undefined || precio_venta === null || isNaN(pVenta)) {
    errors.push('Precio de venta es requerido y debe ser un número');
  } else if (pVenta <= 0) {
    errors.push('Precio de venta debe ser mayor a 0');
  }

  // Validar que precio venta >= precio compra
  if (!isNaN(pVenta) && !isNaN(pCompra) && pVenta < pCompra) {
    errors.push('Precio de venta debe ser mayor o igual al precio de compra');
  }

  // Validar stock actual
  if (stock_actual !== undefined && stock_actual !== null) {
    const sActual = parseInt(stock_actual);
    if (isNaN(sActual) || sActual < 0) {
      errors.push('Stock actual debe ser un número entero mayor o igual a 0');
    }
  }

  // Validar stock mínimo
  if (stock_minimo !== undefined && stock_minimo !== null) {
    const sMinimo = parseInt(stock_minimo);
    if (isNaN(sMinimo) || sMinimo < 0) {
      errors.push('Stock mínimo debe ser un número entero mayor o igual a 0');
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
  if (sku !== undefined && sku !== null) {
    const trimmedSku = sku.trim();
    if (typeof sku !== 'string' || trimmedSku.length === 0) {
      errors.push('SKU debe ser texto no vacío');
    } else if (trimmedSku.length > 50) {
      errors.push('SKU no puede exceder 50 caracteres');
    }
    if (!/^[A-Z0-9-]+$/.test(trimmedSku)) {
      errors.push('SKU solo puede contener letras mayúsculas, números y guiones');
    }
  }

  if (nombre !== undefined && nombre !== null) {
    const trimmedNombre = nombre.trim();
    if (trimmedNombre.length < 3) {
      errors.push('Nombre debe tener al menos 3 caracteres');
    }
    if (trimmedNombre.length > 200) {
      errors.push('Nombre no puede exceder 200 caracteres');
    }
  }

  if (precio_compra !== undefined && precio_compra !== null) {
    const pCompra = parseFloat(precio_compra);
    if (isNaN(pCompra) || pCompra <= 0) {
      errors.push('Precio de compra debe ser un número mayor a 0');
    }
  }

  if (precio_venta !== undefined && precio_venta !== null) {
    const pVenta = parseFloat(precio_venta);
    if (isNaN(pVenta) || pVenta <= 0) {
      errors.push('Precio de venta debe ser un número mayor a 0');
    }
  }

  // Validar relación de precios si ambos están presentes
  if (precio_compra !== undefined && precio_venta !== undefined) {
    if (parseFloat(precio_venta) < parseFloat(precio_compra)) {
      errors.push('Precio de venta debe ser mayor o igual al precio de compra');
    }
  }

  if (stock_actual !== undefined && stock_actual !== null) {
    const sActual = parseInt(stock_actual);
    if (isNaN(sActual) || sActual < 0) {
      errors.push('Stock actual debe ser un número entero mayor o igual a 0');
    }
  }

  if (stock_minimo !== undefined && stock_minimo !== null) {
    const sMinimo = parseInt(stock_minimo);
    if (isNaN(sMinimo) || sMinimo < 0) {
      errors.push('Stock mínimo debe ser un número entero mayor o igual a 0');
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