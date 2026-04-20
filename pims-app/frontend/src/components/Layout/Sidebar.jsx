import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  ShoppingOutlined,
  FilePdfOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/productos',
      icon: <ShoppingOutlined />,
      label: 'Productos',
    },
    {
      key: '/reportes',
      icon: <FilePdfOutlined />,
      label: 'Reportes',
    },
  ];

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={250}
      style={{
        background: '#FFFFFF',
        boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
      }}
    >
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <AppstoreOutlined style={{ fontSize: 24, color: '#2563EB', marginRight: 8 }} />
        {!collapsed && (
          <span style={{ fontSize: 18, fontWeight: 600, color: '#2563EB' }}>
            PIMS
          </span>
        )}
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{
          background: 'transparent',
          border: 'none',
          marginTop: 16,
        }}
      />
    </Sider>
  );
};

export default Sidebar;