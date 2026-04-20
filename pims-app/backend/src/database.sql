-- Crear base de datos
CREATE DATABASE pims_db;



-- Crear tabla productos
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(100) NOT NULL,
    precio_compra DECIMAL(10,2) NOT NULL CHECK (precio_compra >= 0),
    precio_venta DECIMAL(10,2) NOT NULL CHECK (precio_venta >= 0),
    stock_actual INTEGER NOT NULL DEFAULT 0 CHECK (stock_actual >= 0),
    stock_minimo INTEGER NOT NULL DEFAULT 5 CHECK (stock_minimo >= 0),
    proveedor VARCHAR(200),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar rendimiento
CREATE INDEX idx_productos_sku ON productos(sku);
CREATE INDEX idx_productos_categoria ON productos(categoria);
CREATE INDEX idx_productos_nombre ON productos(nombre);
CREATE INDEX idx_productos_stock ON productos(stock_actual);

-- Crear trigger para actualizar fecha_ultima_actualizacion
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_ultima_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_producto_timestamp
    BEFORE UPDATE ON productos
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

INSERT INTO productos (
    sku, nombre, descripcion, categoria, 
    precio_compra, precio_venta, stock_actual, stock_minimo, proveedor,
    fecha_creacion, fecha_ultima_actualizacion
) VALUES
('ELEC-001', 'Laptop HP ProBook', 'Laptop empresarial 15.6"', 'Electrónicos', 650.00, 899.99, 25, 10, 'TechSupply Co.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ELEC-002', 'Monitor Dell 24"', 'Monitor LED Full HD', 'Electrónicos', 120.00, 199.99, 45, 15, 'TechSupply Co.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ELEC-003', 'Teclado Mecánico RGB', 'Teclado gaming con switches blue', 'Electrónicos', 35.00, 79.99, 60, 20, 'GamerPro Inc.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ROPA-001', 'Camisa Oxford Azul', 'Camisa formal manga larga', 'Ropa', 15.50, 39.99, 120, 30, 'Fashion Wholesale', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ROPA-002', 'Pantalón Chino Beige', 'Pantalón casual slim fit', 'Ropa', 22.00, 49.99, 85, 25, 'Fashion Wholesale', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ROPA-003', 'Chaqueta Denim', 'Chaqueta de mezclilla clásica', 'Ropa', 28.00, 69.99, 40, 15, 'Denim Masters', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ALIM-001', 'Café Orgánico 500g', 'Café de altura tostado medio', 'Alimentos', 4.50, 12.99, 200, 50, 'Coffee Imports Ltd.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ALIM-002', 'Chocolate Artesanal', 'Tableta de chocolate 70% cacao', 'Alimentos', 2.80, 7.99, 150, 40, 'Sweet Delights', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ALIM-003', 'Aceite de Oliva Extra Virgen', 'Botella 500ml', 'Alimentos', 5.20, 14.99, 95, 30, 'Mediterranean Foods', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('HOG-001', 'Juego de Sábanas Queen', 'Sábanas 100% algodón 400 hilos', 'Hogar', 18.00, 45.99, 55, 15, 'Home Textiles SA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('HOG-002', 'Batidora de Pie', 'Batidora 5 velocidades 300W', 'Hogar', 32.00, 79.99, 30, 10, 'KitchenPro', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('HOG-003', 'Juego de Toallas', 'Set de 6 toallas de baño', 'Hogar', 24.00, 59.99, 70, 20, 'Home Textiles SA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('JUG-001', 'Bloques de Construcción', 'Set 500 piezas creativas', 'Juguetes', 15.00, 34.99, 90, 25, 'ToyWorld', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('JUG-002', 'Pista de Carreras', 'Circuito eléctrico con 2 autos', 'Juguetes', 22.00, 49.99, 45, 15, 'ToyWorld', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('JUG-003', 'Muñeca Interactiva', 'Muñeca que habla y canta', 'Juguetes', 18.00, 39.99, 35, 12, 'Kids Paradise', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Stock bajo
('ELEC-004', 'Mouse Inalámbrico', 'Mouse ergonómico Bluetooth', 'Electrónicos', 8.00, 24.99, 3, 10, 'TechSupply Co.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ROPA-004', 'Cinturón de Cuero', 'Cinturón genuino color café', 'Ropa', 12.00, 29.99, 2, 8, 'Leather Goods Co.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ALIM-004', 'Miel Pura 250g', 'Miel orgánica multifloral', 'Alimentos', 3.50, 9.99, 4, 15, 'BeeNatural', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('HOG-004', 'Lámpara de Mesa LED', 'Lámpara regulable luz cálida', 'Hogar', 16.00, 39.99, 1, 5, 'Lighting Pro', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
-- Crear vista para productos bajo stock
CREATE VIEW vista_productos_bajo_stock AS
SELECT 
    id,
    sku,
    nombre,
    categoria,
    stock_actual,
    stock_minimo,
    (stock_minimo - stock_actual) AS deficit,
    proveedor,
    precio_compra,
    precio_venta
FROM productos
WHERE stock_actual < stock_minimo
ORDER BY deficit DESC;

-- Crear vista para valorización de inventario
CREATE VIEW vista_valor_inventario AS
SELECT 
    categoria,
    COUNT(*) as total_productos,
    SUM(stock_actual) as total_unidades,
    SUM(stock_actual * precio_compra) as valor_costo,
    SUM(stock_actual * precio_venta) as valor_venta_potencial
FROM productos
GROUP BY categoria
ORDER BY valor_costo DESC;

-- Comentarios en la tabla
COMMENT ON TABLE productos IS 'Tabla principal para gestión de productos e inventario';
COMMENT ON COLUMN productos.sku IS 'Código único de identificación del producto';
COMMENT ON COLUMN productos.precio_compra IS 'Costo de adquisición del producto';
COMMENT ON COLUMN productos.precio_venta IS 'Precio de venta al público';
COMMENT ON COLUMN productos.stock_actual IS 'Cantidad disponible actual';
COMMENT ON COLUMN productos.stock_minimo IS 'Umbral mínimo para alertas de reorden';