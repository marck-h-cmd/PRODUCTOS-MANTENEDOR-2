const Producto = require('./Producto');

// Sincronizar modelos con la base de datos
const syncModels = async () => {
  try {
    await Producto.sync({ alter: true });
    console.log('✅ Modelos sincronizados con la base de datos');
  } catch (error) {
    console.error('❌ Error al sincronizar modelos:', error);
  }
};

module.exports = {
  Producto,
  syncModels
};