const Producto = require('../models/Producto');
const reportService = require('../services/reportService');
const { Sequelize, Op } = require('sequelize');

exports.getInventoryReport = async (req, res) => {
  try {
    const { categoria } = req.query;
    const where = {};
    if (categoria) where.categoria = categoria;

    const productos = await Producto.findAll({
      where,
      order: [['nombre', 'ASC']],
      raw: true
    });

    // Calcular totales para el reporte
    const totalStock = productos.reduce((sum, p) => sum + (p.stock_actual || 0), 0);
    const totalValor = productos.reduce((sum, p) => sum + (p.stock_actual * p.precio_venta || 0), 0).toFixed(2);

    const reportData = { 
      productos, 
      categoria: categoria || 'Todas',
      totalStock,
      totalValor,
      fecha: new Date().toLocaleDateString()
    };
    
    try {
      const pdf = await reportService.generatePDF('inventario-template', reportData);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="reporte-inventario.pdf"');
      return res.send(Buffer.from(pdf));
    } catch (err) {
      console.error('Error en generatePDF (Inventory):', err);
      return res.status(500).json({ 
        success: false,
        message: 'No se pudo generar el PDF. Asegúrate de que jsReport esté configurado correctamente.',
        error: err.message
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al generar reporte de inventario', error: error.message });
  }
};

exports.getManagementReport = async (req, res) => {
  try {
    // 1. Obtener KPIs principales
    const totalProductos = await Producto.count();
    const valorizacionResult = await Producto.findAll({
      attributes: [[Sequelize.fn('SUM', Sequelize.literal('stock_actual * precio_compra')), 'total']],
      raw: true
    });
    const stockCritico = await Producto.count({
      where: { stock_actual: { [Op.lt]: Sequelize.col('stock_minimo') } }
    });

    // 2. Obtener Top Categorías (por cantidad de productos)
    const topCategorias = await Producto.findAll({
      attributes: [
        ['categoria', 'name'],
        [Sequelize.fn('COUNT', Sequelize.col('sku')), 'count']
      ],
      group: ['categoria'],
      order: [[Sequelize.fn('COUNT', Sequelize.col('sku')), 'DESC']],
      limit: 5,
      raw: true
    });

    // 3. Obtener Productos por Reordenar (Bajo Stock)
    const reorderList = await Producto.findAll({
      where: {
        stock_actual: { [Op.lt]: Sequelize.col('stock_minimo') }
      },
      order: [['stock_actual', 'ASC']],
      raw: true
    });

    const data = {
      kpis: {
        totalProductos,
        valorizacion: parseFloat(valorizacionResult[0].total || 0).toFixed(2),
        stockCritico
      },
      topCategorias,
      reorderList,
      fecha: new Date().toLocaleDateString()
    };

    try {
      const pdf = await reportService.generatePDF('gestion-template', data);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="reporte-gestion.pdf"');
      return res.send(Buffer.from(pdf));
    } catch (err) {
      console.error('Error en generatePDF (Management):', err);
      return res.status(500).json({ 
        success: false,
        message: 'No se pudo generar el reporte de gestión. jsReport local falló.',
        error: err.message
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al generar reporte de gestión', error: error.message });
  }
};
