import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Typography, Spin, message } from 'antd';
import { 
  ShoppingOutlined, 
  DollarOutlined, 
  AlertOutlined, 
  StarOutlined 
} from '@ant-design/icons';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { dashboardService } from '../../services/api';

const { Title } = Typography;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState(null);
  const [charts, setCharts] = useState(null);
  const [reorder, setReorder] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [kpisRes, chartsRes, reorderRes] = await Promise.all([
          dashboardService.getKPIs(),
          dashboardService.getCharts(),
          dashboardService.getReorder()
        ]);
        setKpis(kpisRes.data);
        setCharts(chartsRes.data);
        setReorder(reorderRes.data);
      } catch (error) {
        message.error('Error al cargar datos del dashboard');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;

  const reorderColumns = [
    { title: 'SKU', dataIndex: 'sku', key: 'sku' },
    { title: 'Producto', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Stock Actual', dataIndex: 'stock_actual', key: 'stock_actual', render: (val) => <span style={{ color: 'red', fontWeight: 'bold' }}>{val}</span> },
    { title: 'Mínimo', dataIndex: 'stock_minimo', key: 'stock_minimo' },
  ];

  return (
    <div>
      <Title level={2}>Panel de Control</Title>
      
      {/* KPIs */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Productos Únicos"
              value={kpis?.totalProductos}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Valorización Total"
              value={kpis?.valorizacion}
              prefix={<DollarOutlined />}
              precision={2}
              suffix="USD"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Alertas de Stock"
              value={kpis?.stockCritico}
              prefix={<AlertOutlined />}
              valueStyle={{ color: kpis?.stockCritico > 0 ? '#cf1322' : '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Producto Más Valioso"
              value={kpis?.productoMasValioso?.valor}
              prefix={<StarOutlined />}
              precision={2}
              suffix="USD"
              description={kpis?.productoMasValioso?.nombre}
            />
            <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
              {kpis?.productoMasValioso?.nombre}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="Top 10 Categorías (Cantidad)" bordered={false}>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={charts?.categorias}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563EB" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Valorización por Categoría" bordered={false}>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={charts?.valorizacion}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {charts?.valorizacion.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Reorder Table */}
      <Card title="Productos a Reordenar (Bajo Stock)" style={{ marginTop: '24px' }} bordered={false}>
        <Table 
          dataSource={reorder} 
          columns={reorderColumns} 
          rowKey="id" 
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
