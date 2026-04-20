const Producto = require('../models/Producto');
const { Op, Sequelize } = require('sequelize');

exports.getAllProductos = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', categoria = '' } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { sku: { [Op.iLike]: `%${search}%` } },
        { nombre: { [Op.iLike]: `%${search}%` } },
        { proveedor: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (categoria) {
      where.categoria = categoria;
    }

    const { count, rows } = await Producto.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['fecha_ultima_actualizacion', 'DESC']],
      attributes: { exclude: ['descripcion'] } // Optimización: no traer descripción larga en el listado
    });

    res.json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      productos: rows
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
};

exports.getProductoById = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
  }
};

exports.createProducto = async (req, res) => {
  try {
    const producto = await Producto.create(req.body);
    res.status(201).json(producto);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'El SKU ya existe' });
    }
    res.status(500).json({ message: 'Error al crear producto', error: error.message });
  }
};

exports.updateProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });

    await producto.update(req.body);
    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
  }
};

exports.deleteProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });

    await producto.destroy();
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
  }
};

exports.getCategorias = async (req, res) => {
  try {
    const categorias = await Producto.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('categoria')), 'categoria']],
      raw: true
    });
    res.json(categorias.map(c => c.categoria).filter(Boolean));
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener categorías', error: error.message });
  }
};
