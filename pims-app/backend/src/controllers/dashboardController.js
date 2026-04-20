const Producto = require('../models/Producto');
const { Sequelize, Op } = require('sequelize');

exports.getKPIs = async (req, res) => {
  try {
    // 1. Total Productos Únicos
    const totalProductos = await Producto.count();

    // 2. Valorización del Inventario
    const valorizacion = await Producto.findAll({
      attributes: [
        [Sequelize.fn('SUM', Sequelize.literal('stock_actual * precio_compra')), 'total']
      ],
      raw: true
    });

    // 3. Alertas de Stock Crítico
    const stockCritico = await Producto.count({
      where: {
        stock_actual: { [Op.lt]: Sequelize.col('stock_minimo') }
      }
    });

    // 4. Producto Más Valioso
    const productoMasValioso = await Producto.findOne({
      attributes: [
        'nombre',
        [Sequelize.literal('stock_actual * precio_compra'), 'valor']
      ],
      order: [[Sequelize.literal('valor'), 'DESC']],
      limit: 1,
      raw: true
    });

    res.json({
      totalProductos,
      valorizacion: parseFloat(valorizacion[0].total || 0),
      stockCritico,
      productoMasValioso: productoMasValioso ? {
        nombre: productoMasValioso.nombre,
        valor: parseFloat(productoMasValioso.valor)
      } : null
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener KPIs', error: error.message });
  }
};

exports.getChartsData = async (req, res) => {
  try {
    // Gráfico de Barras: Distribución por Top 10 Categorías
    const categoriasData = await Producto.findAll({
      attributes: [
        'categoria',
        [Sequelize.fn('COUNT', Sequelize.col('sku')), 'cantidad']
      ],
      group: ['categoria'],
      order: [[Sequelize.fn('COUNT', Sequelize.col('sku')), 'DESC']],
      limit: 10,
      raw: true
    });

    // Gráfico Circular: Valorización por Categoría
    const valorizacionData = await Producto.findAll({
      attributes: [
        'categoria',
        [Sequelize.fn('SUM', Sequelize.literal('stock_actual * precio_compra')), 'valor']
      ],
      group: ['categoria'],
      raw: true
    });

    res.json({
      categorias: categoriasData.map(c => ({
        name: c.categoria || 'Sin Categoría',
        count: parseInt(c.cantidad)
      })),
      valorizacion: valorizacionData.map(v => ({
        name: v.categoria || 'Sin Categoría',
        value: parseFloat(v.valor || 0)
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener datos de gráficos', error: error.message });
  }
};

exports.getReorderList = async (req, res) => {
  try {
    const list = await Producto.findAll({
      where: {
        stock_actual: { [Op.lt]: Sequelize.col('stock_minimo') }
      },
      order: [['stock_actual', 'ASC']]
    });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener lista de reorden', error: error.message });
  }
};
