const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Producto = sequelize.define('Producto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    index: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  categoria: {
    type: DataTypes.STRING,
    index: true
  },
  precio_compra: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  precio_venta: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  stock_actual: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  stock_minimo: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },
  proveedor: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'productos',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_ultima_actualizacion'
});

module.exports = Producto;
