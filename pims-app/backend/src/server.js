const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

// Importar middlewares
const { errorHandler, notFound } = require('./src/middleware/errorHandler');
const { customLogger, developmentLogger } = require('./src/middleware/logger');

// Importar configuración y modelos
const { testConnection } = require('./src/config/database');
const { syncModels } = require('./src/models');

// Importar rutas
const productoRoutes = require('./src/routes/productoRoutes');
const reporteRoutes = require('./src/routes/reporteRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ========== MIDDLEWARES GLOBALES ==========

// Seguridad básica con Helmet
app.use(helmet({
  contentSecurityPolicy: false, // Desactivar para desarrollo
  crossOriginEmbedderPolicy: false
}));

// Compresión de respuestas
app.use(compression());

// Configuración CORS mejorada
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// Logging
app.use(customLogger);
if (process.env.NODE_ENV === 'development') {
  app.use(developmentLogger);
}

// Parseo de JSON y URL-encoded
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ========== RUTAS ==========

// Ruta de health check mejorada
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    memory: process.memoryUsage()
  });
});

// API Routes
app.use('/api/productos', productoRoutes);
app.use('/api/reportes', reporteRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    name: 'PIMS API',
    version: '1.0.0',
    description: 'Sistema de Gestión de Productos e Inventario',
    endpoints: {
      productos: '/api/productos',
      reportes: '/api/reportes',
      health: '/health'
    },
    documentation: '/api-docs'
  });
});

// ========== MANEJO DE ERRORES ==========

// 404 para rutas no encontradas
app.use(notFound);

// Manejador global de errores
app.use(errorHandler);

// ========== INICIALIZACIÓN DEL SERVIDOR ==========

const startServer = async () => {
  try {
    // Probar conexión a base de datos
    await testConnection();
    
    // Sincronizar modelos
    await syncModels();
    
    // Iniciar servidor
    const server = app.listen(PORT, () => {
      console.log('='.repeat(50));
      console.log(`🚀 Servidor PIMS ejecutándose en:`);
      console.log(`   - Local: http://localhost:${PORT}`);
      console.log(`   - API: http://localhost:${PORT}/api`);
      console.log(`   - Health: http://localhost:${PORT}/health`);
      console.log(`   - Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log('='.repeat(50));
    });

    // Manejo graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`\n⚠️ Recibida señal ${signal}. Cerrando servidor gracefully...`);
      
      server.close(async () => {
        console.log('✅ Servidor HTTP cerrado');
        
        // Cerrar conexión de base de datos
        const { sequelize } = require('./src/config/database');
        await sequelize.close();
        console.log('✅ Conexión a base de datos cerrada');
        
        process.exit(0);
      });
      
      // Forzar cierre después de 10 segundos
      setTimeout(() => {
        console.error('❌ No se pudo cerrar gracefully, forzando cierre');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

startServer();

module.exports = app; // Para testing