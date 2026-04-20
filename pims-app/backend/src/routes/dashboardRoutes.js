const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/kpis', dashboardController.getKPIs);
router.get('/charts', dashboardController.getChartsData);
router.get('/reorder', dashboardController.getReorderList);

module.exports = router;
