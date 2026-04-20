# PIMS - Product Inventory Management System

Sistema integral para la gestión de inventarios, análisis de stock y generación de reportes inteligentes.

## 🚀 Tecnologías Utilizadas

### Backend
- **Node.js & Express**: API RESTful.
- **Sequelize (ORM)**: Gestión de base de datos PostgreSQL.
- **jsReport (Core)**: Motor de generación de reportes PDF local.
- **Axios**: Comunicación entre servicios.

### Frontend
- **React (Vite)**: Framework de interfaz de usuario.
- **Ant Design**: Biblioteca de componentes UI.
- **Recharts**: Visualización de datos y gráficos.
- **React Router**: Gestión de navegación.

---

## 📋 Requisitos Previos

- **Node.js** (v18 o superior recomendado)
- **PostgreSQL** (v14 o superior)
- **npm** o **yarn**

---

## 🛠️ Configuración e Instalación

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd software-practice-i
```

### 2. Configurar el Backend
1. Navega a la carpeta del backend:
   ```bash
   cd pims-app/backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` basado en las necesidades del proyecto (ver ejemplo abajo):
   ```env
   PORT=5000
   DB_NAME=pims_db
   DB_USER=postgres
   DB_PASS=tu_contraseña
   DB_HOST=localhost
   NODE_ENV=development
   ```
4. Asegúrate de tener creada la base de datos `pims_db` en PostgreSQL.

### 3. Configurar el Frontend
1. Navega a la carpeta del frontend:
   ```bash
   cd ../frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

---

## ⚡ Ejecución del Proyecto

### Iniciar el Backend
Desde la carpeta `pims-app/backend`:
```bash
npm start
```
*El servidor se iniciará en `http://localhost:5000` y sincronizará automáticamente los modelos con la base de datos.*

### Iniciar el Frontend
Desde la carpeta `pims-app/frontend`:
```bash
npm run dev
```
*La aplicación estará disponible en `http://localhost:5173` (o el puerto que asigne Vite).*

---

## 📊 Funcionalidades Principales

1. **Dashboard Inteligente**: Visualización de KPIs clave (Total de productos, Valor de inventario, Stock crítico).
2. **Gestión de Productos**: CRUD completo de productos con validaciones de SKU y stock mínimo.
3. **Módulo de Reportes**:
   - **Reporte Operacional**: Listado detallado de inventario en PDF.
   - **Análisis Ejecutivo**: Reporte de gestión con gráficos y detección de productos bajo stock.
4. **Alertas de Reorden**: Identificación automática de productos que requieren reposición.

---

## 📁 Estructura del Proyecto

```
software-practice-i/
├── pims-app/
│   ├── backend/        # API REST y lógica de negocio
│   │   ├── src/        # Código fuente (controllers, models, routes, services)
│   │   └── server.js   # Punto de entrada
│   ├── frontend/       # Interfaz de usuario React
│   │   ├── src/        # Componentes y páginas
│   │   └── index.html
│   └── reports/        # Plantillas HTML para jsReport
└── .gitignore          # Configuración de Git
```
