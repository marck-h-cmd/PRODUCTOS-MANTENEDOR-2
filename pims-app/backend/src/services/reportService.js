const jsreport = require('jsreport-core')();
const path = require('path');
const fs = require('fs').promises;

let initialized = false;

const initJsReport = async () => {
  if (initialized) return;
  
  jsreport.use(require('jsreport-handlebars')());
  jsreport.use(require('jsreport-chrome-pdf')({
    launchOptions: {
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  }));

  await jsreport.init();
  initialized = true;
  console.log('jsReport (Core) inicializado correctamente.');
};

exports.generatePDF = async (templateName, data) => {
  try {
    if (!initialized) {
      await initJsReport();
    }

    // Determinar la ruta del template
    const templatePath = path.join(__dirname, '..', '..', '..', 'reports', 'templates', templateName, 'content.html');
    const htmlContent = await fs.readFile(templatePath, 'utf8');

    const result = await jsreport.render({
      template: {
        content: htmlContent,
        engine: 'handlebars',
        recipe: 'chrome-pdf',
        helpers: `
          function decimalMultiply(a, b) {
            return (parseFloat(a || 0) * parseFloat(b || 0)).toFixed(2);
          }
        `
      },
      data: data
    });

    return result.content;
  } catch (error) {
    console.error('Error generating PDF with jsReport local:', error);
    throw error;
  }
};

exports.initJsReport = initJsReport;
