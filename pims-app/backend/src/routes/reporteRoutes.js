const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');

router.post('/inventario', reporteController.generateInventarioReport);
router.post('/gestion', reporteController.generateGestionReport);

module.exports = router;