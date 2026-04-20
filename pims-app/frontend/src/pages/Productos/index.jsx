import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Input, 
  Space, 
  Typography, 
  Modal, 
  Form, 
  InputNumber, 
  Select, 
  message, 
  Popconfirm,
  Tag
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined 
} from '@ant-design/icons';
import { productosService } from '../../services/api';

const { Title } = Typography;
const { Option } = Select;

const Productos = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchText, setSearchText] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('');
  const [categorias, setCategorias] = useState([]);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  const fetchProductos = async (params = {}) => {
    setLoading(true);
    try {
      const response = await productosService.getAll({
        page: params.pagination?.current || pagination.current,
        limit: params.pagination?.pageSize || pagination.pageSize,
        search: searchText,
        categoria: categoriaFilter
      });
      setData(response.data.productos);
      setPagination({
        ...pagination,
        total: response.data.total,
        current: response.data.currentPage
      });
    } catch (error) {
      message.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const res = await productosService.getCategorias();
      setCategorias(res.data);
    } catch (error) {
      console.error('Error fetching categories');
    }
  };

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, [searchText, categoriaFilter]);

  const handleTableChange = (newPagination) => {
    fetchProductos({ pagination: newPagination });
  };

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    if (product) {
      form.setFieldsValue(product);
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      if (editingProduct) {
        await productosService.update(editingProduct.id, values);
        message.success('Producto actualizado correctamente');
      } else {
        await productosService.create(values);
        message.success('Producto creado correctamente');
      }
      handleCancel();
      fetchProductos();
      fetchCategorias();
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al procesar la solicitud');
    }
  };

  const handleDelete = async (id) => {
    try {
      await productosService.delete(id);
      message.success('Producto eliminado correctamente');
      fetchProductos();
    } catch (error) {
      message.error('Error al eliminar producto');
    }
  };

  const columns = [
    { title: 'SKU', dataIndex: 'sku', key: 'sku', width: 120 },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Categoría', dataIndex: 'categoria', key: 'categoria', render: (cat) => <Tag color="blue">{cat}</Tag> },
    { title: 'Precio Venta', dataIndex: 'precio_venta', key: 'precio_venta', render: (val) => `$${val}` },
    { 
      title: 'Stock', 
      dataIndex: 'stock_actual', 
      key: 'stock_actual',
      render: (stock, record) => (
        <span style={{ color: stock < record.stock_minimo ? 'red' : 'inherit', fontWeight: stock < record.stock_minimo ? 'bold' : 'normal' }}>
          {stock}
        </span>
      )
    },
    { title: 'Proveedor', dataIndex: 'proveedor', key: 'proveedor' },
    {
      title: 'Acciones',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleOpenModal(record)} 
          />
          <Popconfirm
            title="¿Estás seguro de eliminar este producto?"
            description={`Se eliminará ${record.nombre} (${record.sku})`}
            onConfirm={() => handleDelete(record.id)}
            okText="Sí, eliminar"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <Title level={2}>Gestión de Productos</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large" 
          onClick={() => handleOpenModal()}
        >
          Nuevo Producto
        </Button>
      </div>

      <Card bordered={false} style={{ marginBottom: '24px' }}>
        <Space wrap size="large">
          <Input
            placeholder="Buscar por SKU, Nombre o Proveedor"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Select
            placeholder="Filtrar por Categoría"
            style={{ width: 200 }}
            value={categoriaFilter}
            onChange={setCategoriaFilter}
            allowClear
          >
            {categorias.map(cat => (
              <Option key={cat} value={cat}>{cat}</Option>
            ))}
          </Select>
        </Space>
      </Card>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />

      {/* CRUD Modal */}
      <Modal
        title={editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ stock_actual: 0, stock_minimo: 5 }}
          validateTrigger="onBlur"
        >
          <Form.Item 
            name="sku" 
            label="SKU" 
            rules={[
              { required: true, message: 'El SKU es obligatorio' },
              { max: 50, message: 'El SKU no puede tener más de 50 caracteres' },
              { pattern: /^[A-Z0-9-]+$/, message: 'Solo letras mayúsculas, números y guiones' }
            ]}
          >
            <Input disabled={!!editingProduct} placeholder="Ej: PROD-001" />
          </Form.Item>
          
          <Form.Item 
            name="nombre" 
            label="Nombre" 
            rules={[
              { required: true, message: 'El nombre es obligatorio' },
              { min: 3, message: 'El nombre debe tener al menos 3 caracteres' },
              { max: 200, message: 'El nombre no puede exceder los 200 caracteres' }
            ]}
          >
            <Input placeholder="Nombre descriptivo del producto" />
          </Form.Item>
          
          <Form.Item 
            name="descripcion" 
            label="Descripción"
            rules={[{ max: 500, message: 'La descripción no puede exceder los 500 caracteres' }]}
          >
            <Input.TextArea rows={3} placeholder="Detalles adicionales del producto..." />
          </Form.Item>
          
          <Space style={{ display: 'flex' }} align="baseline">
            <Form.Item 
              name="categoria" 
              label="Categoría" 
              style={{ width: 220 }}
              rules={[{ required: true, message: 'La categoría es obligatoria' }]}
            >
              <Input placeholder="Ej. Electrónica" />
            </Form.Item>
            <Form.Item name="proveedor" label="Proveedor" style={{ width: 220 }}>
              <Input placeholder="Nombre del proveedor" />
            </Form.Item>
          </Space>
          
          <Space style={{ display: 'flex' }} align="baseline">
            <Form.Item 
              name="precio_compra" 
              label="Precio Compra" 
              rules={[
                { required: true, message: 'Campo requerido' },
                { type: 'number', min: 0.01, message: 'Debe ser mayor a 0' }
              ]}
            >
              <InputNumber precision={2} style={{ width: 140 }} prefix="$" />
            </Form.Item>
            
            <Form.Item 
              name="precio_venta" 
              label="Precio Venta" 
              dependencies={['precio_compra']}
              rules={[
                { required: true, message: 'Campo requerido' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || value >= getFieldValue('precio_compra')) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Debe ser ≥ precio compra'));
                  },
                }),
              ]}
            >
              <InputNumber precision={2} style={{ width: 140 }} prefix="$" />
            </Form.Item>
          </Space>
          
          <Space style={{ display: 'flex' }} align="baseline">
            <Form.Item 
              name="stock_actual" 
              label="Stock Actual"
              rules={[{ type: 'number', min: 0, message: 'Mínimo 0' }]}
            >
              <InputNumber style={{ width: 140 }} />
            </Form.Item>
            <Form.Item 
              name="stock_minimo" 
              label="Stock Mínimo"
              rules={[{ type: 'number', min: 0, message: 'Mínimo 0' }]}
            >
              <InputNumber style={{ width: 140 }} />
            </Form.Item>
          </Space>
          
          <Form.Item style={{ textAlign: 'right', marginBottom: 0, marginTop: 24 }}>
            <Button onClick={handleCancel} style={{ marginRight: 8 }}>Cancelar</Button>
            <Button type="primary" htmlType="submit">Guardar</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Productos;
