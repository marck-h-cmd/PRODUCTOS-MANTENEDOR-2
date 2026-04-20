import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Row, Col, Select, Space, message, Divider } from 'antd';
import { 
  FilePdfOutlined, 
  BarChartOutlined, 
  TableOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { reportesService, productosService } from '../../services/api';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const Reportes = () => {
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [loadingManagement, setLoadingManagement] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState('');

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await productosService.getCategorias();
        setCategorias(res.data);
      } catch (err) {
        console.error('Error fetching categories');
      }
    };
    fetchCats();
  }, []);

  const handleDownloadInventory = async () => {
    setLoadingInventory(true);
    try {
      const response = await reportesService.getInventoryPDF(selectedCategoria);
      
      // Si la respuesta es JSON (fallback del backend)
      if (response.data.type === 'application/json') {
        const text = await response.data.text();
        const json = JSON.parse(text);
        message.warning(json.message);
        console.log('Report Data:', json.data);
      } else {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Reporte_Inventario_${selectedCategoria || 'General'}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        message.success('Reporte generado correctamente');
      }
    } catch (error) {
      message.error('Error al generar el reporte');
      console.error(error);
    } finally {
      setLoadingInventory(false);
    }
  };

  const handleDownloadManagement = async () => {
    setLoadingManagement(true);
    try {
      const response = await reportesService.getManagementPDF();
      
      if (response.data.type === 'application/json') {
        const text = await response.data.text();
        const json = JSON.parse(text);
        message.warning(json.message);
        console.log('Management Report Data:', json.data);
      } else {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Analisis_Salud_Inventario.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
        message.success('Reporte de gestión generado');
      }
    } catch (error) {
      message.error('Error al generar el reporte');
      console.error(error);
    } finally {
      setLoadingManagement(false);
    }
  };

  return (
    <div>
      <Title level={2}>Módulo de Reportes Inteligentes</Title>
      <Paragraph>
        Genera documentos profesionales para la toma de decisiones estratégicas.
      </Paragraph>

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        {/* Operacional Report */}
        <Col xs={24} md={12}>
          <Card 
            title={<span><TableOutlined /> Reporte Operacional</span>} 
            bordered={false}
            hoverable
          >
            <Title level={4}>Listado de Inventario Actual</Title>
            <Paragraph>
              Genera una tabla completa de productos con su stock y valorización actual.
            </Paragraph>
            
            <Divider />
            
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>Filtrar por Categoría (Opcional):</Text>
              <Select
                placeholder="Todas las categorías"
                style={{ width: '100%' }}
                allowClear
                onChange={setSelectedCategoria}
                value={selectedCategoria}
              >
                {categorias.map(cat => (
                  <Option key={cat} value={cat}>{cat}</Option>
                ))}
              </Select>
              
              <Button 
                type="primary" 
                icon={<FilePdfOutlined />} 
                block 
                size="large"
                loading={loadingInventory}
                onClick={handleDownloadInventory}
                style={{ marginTop: '16px' }}
              >
                Generar PDF de Inventario
              </Button>
            </Space>
          </Card>
        </Col>

        {/* Management Report */}
        <Col xs={24} md={12}>
          <Card 
            title={<span><BarChartOutlined /> Reporte de Gestión</span>} 
            bordered={false}
            hoverable
          >
            <Title level={4}>Análisis de Salud de Inventario</Title>
            <Paragraph>
              Informe ejecutivo que incluye KPIs, gráficos de distribución y lista de reorden.
            </Paragraph>
            
            <Divider />
            
            <Space direction="vertical" style={{ width: '100%', height: '100%', justifyContent: 'space-between' }}>
              <div>
                <Text type="secondary">Incluye:</Text>
                <ul>
                  <li>Resumen de 4 KPIs principales</li>
                  <li>Gráficos de barras y pastel</li>
                  <li>Listado de bajo stock</li>
                </ul>
              </div>

              <Button 
                type="primary" 
                icon={<DownloadOutlined />} 
                block 
                size="large"
                loading={loadingManagement}
                onClick={handleDownloadManagement}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              >
                Descargar Análisis Ejecutivo
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Reportes;
