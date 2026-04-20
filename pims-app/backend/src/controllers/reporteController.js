const { Producto } = require('../models');
const { Op } = require('sequelize');
const { generatePDF } = require('../services/pdfService');

const reporteController = {
  // Generar reporte de inventario (operacional)
  generateInventarioReport: async (req, res) => {
    try {
      const { categoria } = req.body;
      
      const whereClause = {};
      if (categoria) {
        whereClause.categoria = categoria;
      }
      
      const productos = await Producto.findAll({
        where: whereClause,
        order: [['categoria', 'ASC'], ['nombre', 'ASC']]
      });
      
      const templateData = {
        titulo: 'REPORTE DE INVENTARIO ACTUAL',
        fecha: new Date().toLocaleDateString('es-ES'),
        categoria: categoria || 'TODAS',
        productos: productos.map(p => ({
          sku: p.sku,
          nombre: p.nombre,
          categoria: p.categoria,
          stock_actual: p.stock_actual,
          precio_venta: parseFloat(p.precio_venta),
          valor_total: p.stock_actual * parseFloat(p.precio_compra)
        }))
      };
      
      const pdfBuffer = await generatePDF('inventario', templateData);
      
      res.json({
        success: true,
        pdf: pdfBuffer.toString('base64')
      });
    } catch (error) {
      console.error('Error generando PDF:', error);
      res.status(500).json({
        success: false,
        message: 'Error al generar el reporte PDF',
        error: error.message
      });
    }
  },
  
  // Generar reporte de gestión (KPIs + gráficos + bajo stock)
  generateGestionReport: async (req, res) => {
    try {
      // Obtener KPIs
      const totalProductos = await Producto.count();
      const valorInventario = await Producto.sum('stock_actual * precio_compra');
      const productosBajoStock = await Producto.count({
        where: {
          stock_actual: {
            [Op.lt]: Producto.sequelize.col('stock_minimo')
          }
        }
      });
      
      // Datos para gráficos
      const categoriasData = await Producto.findAll({
        attributes: [
          'categoria',
          [Producto.sequelize.fn('COUNT', Producto.sequelize.col('id')), 'total']
        ],
        group: ['categoria'],
        order: [[Producto.sequelize.fn('COUNT', Producto.sequelize.col('id')), 'DESC']],
        limit: 10
      });
      
      const productosCriticos = await Producto.findAll({
        where: {
          stock_actual: {
            [Op.lt]: Producto.sequelize.col('stock_minimo')
          }
        },
        order: [['stock_actual', 'ASC']]
      });
      
      const templateData = {
        titulo: 'ANÁLISIS DE SALUD DE INVENTARIO',
        fecha: new Date().toLocaleDateString('es-ES'),
        kpis: {
          totalProductos,
          valorInventario: parseFloat(valorInventario) || 0,
          productosBajoStock,
          porcentajeCritico: ((productosBajoStock / totalProductos) * 100).toFixed(2)
        },
        categorias: categoriasData,
        productosCriticos: productosCriticos.map(p => ({
          sku: p.sku,
          nombre: p.nombre,
          stock_actual: p.stock_actual,
          stock_minimo: p.stock_minimo,
          deficit: p.stock_minimo - p.stock_actual
        }))
      };
      
      const pdfBuffer = await generatePDF('gestion', templateData);
      
      res.json({
        success: true,
        pdf: pdfBuffer.toString('base64')
      });
    } catch (error) {
      console.error('Error generando PDF de gestión:', error);
      res.status(500).json({
        success: false,
        message: 'Error al generar el reporte de gestión',
        error: error.message
      });
    }
  }
};

module.exports = reporteController;