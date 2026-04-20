import React from 'react';
import { Layout, Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;

const Header = ({ collapsed, setCollapsed }) => {
  return (
    <AntHeader
      style={{
        padding: '0 24px',
        background: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ color: '#6B7280' }}>Admin</span>
      </div>
    </AntHeader>
  );
};

export default Header;