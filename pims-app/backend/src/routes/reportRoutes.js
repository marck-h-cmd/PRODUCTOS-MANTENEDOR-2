const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/inventory', reportController.getInventoryReport);
router.get('/management', reportController.getManagementReport);

module.exports = router;
