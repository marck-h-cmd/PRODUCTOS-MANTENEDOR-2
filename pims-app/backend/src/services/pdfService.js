const axios = require('axios');

const JSREPORT_URL = process.env.JSREPORT_URL || 'http://localhost:5488';

const generatePDF = async (templateName, data) => {
  try {
    const templates = {
      inventario: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #2563EB; border-bottom: 3px solid #2563EB; padding-bottom: 10px; }
            h2 { color: #4B5563; margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #2563EB; color: white; padding: 12px; text-align: left; }
            td { padding: 10px; border-bottom: 1px solid #E5E7EB; }
            tr:nth-child(even) { background-color: #F9FAFB; }
            .header-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .total { font-weight: bold; background-color: #F3F4F6; }
          </style>
        </head>
        <body>
          <h1>{{titulo}}</h1>
          <div class="header-info">
            <span><strong>Fecha:</strong> {{fecha}}</span>
            <span><strong>Categoría:</strong> {{categoria}}</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Precio Venta</th>
                <th>Valor Total</th>
              </tr>
            </thead>
            <tbody>
              {{#each productos}}
              <tr>
                <td>{{sku}}</td>
                <td>{{nombre}}</td>
                <td>{{categoria}}</td>
                <td>{{stock_actual}}</td>
                <td>${{formatNumber precio_venta}}</td>
                <td>${{formatNumber valor_total}}</td>
              </tr>
              {{/each}}
            </tbody>
          </table>
          <p style="margin-top: 30px; color: #6B7280; font-size: 12px;">
            Reporte generado automáticamente - Sistema PIMS
          </p>
        </body>
        </html>
      `,
      gestion: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #2563EB; border-bottom: 3px solid #2563EB; padding-bottom: 10px; }
            h2 { color: #4B5563; margin-top: 30px; }
            .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0; }
            .kpi-card { background: #F3F4F6; padding: 20px; border-radius: 8px; border-left: 4px solid #2563EB; }
            .kpi-label { font-size: 14px; color: #6B7280; margin-bottom: 5px; }
            .kpi-value { font-size: 28px; font-weight: bold; color: #111827; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #DC2626; color: white; padding: 12px; text-align: left; }
            td { padding: 10px; border-bottom: 1px solid #E5E7EB; }
            .warning { color: #DC2626; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>{{titulo}}</h1>
          <p><strong>Fecha de Análisis:</strong> {{fecha}}</p>
          
          <h2>📊 Indicadores Clave (KPIs)</h2>
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-label">Total Productos</div>
              <div class="kpi-value">{{kpis.totalProductos}}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Valor Inventario</div>
              <div class="kpi-value">${{formatNumber kpis.valorInventario}}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Productos Bajo Stock</div>
              <div class="kpi-value">{{kpis.productosBajoStock}}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">% Crítico</div>
              <div class="kpi-value">{{kpis.porcentajeCritico}}%</div>
            </div>
          </div>
          
          <h2>⚠️ Productos que Requieren Reorden</h2>
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Producto</th>
                <th>Stock Actual</th>
                <th>Stock Mínimo</th>
                <th>Déficit</th>
              </tr>
            </thead>
            <tbody>
              {{#each productosCriticos}}
              <tr>
                <td>{{sku}}</td>
                <td>{{nombre}}</td>
                <td class="warning">{{stock_actual}}</td>
                <td>{{stock_minimo}}</td>
                <td class="warning">{{deficit}}</td>
              </tr>
              {{/each}}
            </tbody>
          </table>
        </body>
        </html>
      `
    };
    
    // Registrar helpers de formato
    const handlebars = require('handlebars');
    handlebars.registerHelper('formatNumber', (value) => {
      return parseFloat(value).toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    });
    
    const template = handlebars.compile(templates[templateName]);
    const html = template(data);
    
    // Enviar a jsReport
    const response = await axios.post(`${JSREPORT_URL}/api/report`, {
      template: { content: html, engine: 'handlebars', recipe: 'chrome-pdf' },
      data
    }, {
      responseType: 'arraybuffer'
    });
    
    return Buffer.from(response.data);
  } catch (error) {
    console.error('Error en servicio PDF:', error);
    throw error;
  }
};

module.exports = { generatePDF };