const sequelize = require('../config/database');
const Producto = require('../models/Producto');

const seedData = [
  {
    sku: 'PROD-001',
    nombre: 'Laptop Pro 15',
    descripcion: 'Laptop de alto rendimiento para profesionales',
    categoria: 'Electrónica',
    precio_compra: 800.00,
    precio_venta: 1200.00,
    stock_actual: 15,
    stock_minimo: 5,
    proveedor: 'TechCorp'
  },
  {
    sku: 'PROD-002',
    nombre: 'Monitor 27" 4K',
    descripcion: 'Monitor ultra HD para diseño gráfico',
    categoria: 'Electrónica',
    precio_compra: 250.00,
    precio_venta: 450.00,
    stock_actual: 3,
    stock_minimo: 5,
    proveedor: 'DisplaySolutions'
  },
  {
    sku: 'PROD-003',
    nombre: 'Silla Ergonómica',
    descripcion: 'Silla de oficina con soporte lumbar',
    categoria: 'Muebles',
    precio_compra: 120.00,
    precio_venta: 220.00,
    stock_actual: 20,
    stock_minimo: 10,
    proveedor: 'OfficeStyle'
  },
  {
    sku: 'PROD-004',
    nombre: 'Teclado Mecánico',
    descripcion: 'Teclado RGB con switches blue',
    categoria: 'Accesorios',
    precio_compra: 45.00,
    precio_venta: 85.00,
    stock_actual: 30,
    stock_minimo: 10,
    proveedor: 'GamerGear'
  },
  {
    sku: 'PROD-005',
    nombre: 'Escritorio Ajustable',
    descripcion: 'Escritorio con motor eléctrico para trabajar de pie',
    categoria: 'Muebles',
    precio_compra: 300.00,
    precio_venta: 550.00,
    stock_actual: 2,
    stock_minimo: 5,
    proveedor: 'OfficeStyle'
  }
];

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('Base de datos reseteada.');
    
    await Producto.bulkCreate(seedData);
    console.log('Datos de prueba insertados correctamente.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error al insertar datos de prueba:', error);
    process.exit(1);
  }
}

seed();
