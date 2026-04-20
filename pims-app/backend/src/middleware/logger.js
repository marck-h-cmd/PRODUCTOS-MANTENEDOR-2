/**
 * Middleware de logging para monitoreo de peticiones HTTP
 */

const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Crear directorio de logs si no existe
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Formato personalizado para logs
const logFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms';

// Logger para desarrollo (consola)
const developmentLogger = morgan('dev', {
  skip: (req) => req.url === '/health'
});

// Logger para producción (archivo)
const productionLogger = morgan(logFormat, {
  skip: (req) => req.url === '/health',
  stream: fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' })
});

// Logger de errores separado
const errorLogger = morgan(logFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: fs.createWriteStream(path.join(logDir, 'error.log'), { flags: 'a' })
});

/**
 * Middleware de logging personalizado
 */
const customLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    };
    
    // Log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      const color = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m';
      console.log(`${color}${log.method} ${log.url} ${log.status} ${log.duration}\x1b[0m`);
    }
  });
  
  next();
};

module.exports = {
  developmentLogger,
  productionLogger,
  errorLogger,
  customLogger
};