const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const { 
  validateProductCreate, 
  validateProductUpdate, 
  validateId 
} = require('../middleware/validator');

// Rutas públicas
router.get('/', productoController.getAll);
router.get('/kpis', productoController.getKPIs);
router.get('/charts', productoController.getChartData);
router.get('/categorias', productoController.getCategorias);
router.get('/search', productoController.searchProducts);

// Rutas con validación de ID
router.get('/:id', validateId, productoController.getById);
router.put('/:id', validateId, validateProductUpdate, productoController.update);
router.delete('/:id', validateId, productoController.delete);

// Ruta de creación con validación
router.post('/', validateProductCreate, productoController.create);

module.exports = router;