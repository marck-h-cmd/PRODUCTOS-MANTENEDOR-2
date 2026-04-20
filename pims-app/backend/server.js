const app = require('./src/app');
const sequelize = require('./src/config/database');
const { initJsReport } = require('./src/services/reportService');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Sincronizar modelos con la base de datos
    // En producción usar migraciones, aquí usaremos alter: true para facilitar el desarrollo
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    
    // Solución para error "cannot alter type of a column used by a view or rule"
    // Eliminamos las vistas temporales que bloquean el 'alter: true' de Sequelize
    if (process.env.NODE_ENV !== 'production') {
      try {
        await sequelize.query('DROP VIEW IF EXISTS vista_productos_bajo_stock CASCADE;');
        await sequelize.query('DROP VIEW IF EXISTS vista_valor_inventario CASCADE;');
        console.log('Vistas previas eliminadas para permitir la sincronización.');
      } catch (err) {
        console.warn('Advertencia al intentar eliminar vistas:', err.message);
      }
    }

    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados con la base de datos.');

    // Inicializar motor de reportes
    await initJsReport();

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
    process.exit(1);
  }
}

startServer();
