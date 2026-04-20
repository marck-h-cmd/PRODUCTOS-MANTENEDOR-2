import React from 'react';
import { Skeleton, Card, Row, Col, Space } from 'antd';

/**
 * Skeleton para tarjetas KPI del dashboard
 */
export const KPISkeleton = () => (
  <Row gutter={[16, 16]}>
    {[1, 2, 3, 4].map(i => (
      <Col xs={24} sm={12} lg={6} key={i}>
        <Card>
          <Skeleton 
            active 
            paragraph={{ rows: 2 }} 
            title={{ width: '60%' }}
          />
        </Card>
      </Col>
    ))}
  </Row>
);

/**
 * Skeleton para gráficos
 */
export const ChartSkeleton = () => (
  <Row gutter={[16, 16]}>
    <Col xs={24} lg={12}>
      <Card>
        <Skeleton 
          active 
          paragraph={{ rows: 1 }} 
          title={{ width: '40%' }}
        />
        <Skeleton.Image style={{ width: '100%', height: 300 }} />
      </Card>
    </Col>
    <Col xs={24} lg={12}>
      <Card>
        <Skeleton 
          active 
          paragraph={{ rows: 1 }} 
          title={{ width: '40%' }}
        />
        <Skeleton.Image style={{ width: '100%', height: 300 }} />
      </Card>
    </Col>
  </Row>
);

/**
 * Skeleton para tabla de productos
 */
export const TableSkeleton = ({ rows = 5 }) => (
  <Card>
    <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
      <Skeleton.Input style={{ width: 200 }} active />
      <Skeleton.Button active />
    </Space>
    
    {[...Array(rows)].map((_, i) => (
      <Skeleton 
        key={i}
        active 
        avatar={{ shape: 'square', size: 'large' }}
        paragraph={{ rows: 1 }}
        style={{ marginBottom: 8 }}
      />
    ))}
    
    <Skeleton paragraph={{ rows: 1 }} style={{ marginTop: 24 }} />
  </Card>
);

/**
 * Skeleton para formulario
 */
export const FormSkeleton = () => (
  <Card>
    <Skeleton 
      active 
      title={{ width: '30%' }}
      paragraph={{ rows: 1 }}
    />
    {[...Array(6)].map((_, i) => (
      <div key={i} style={{ marginBottom: 24 }}>
        <Skeleton.Input style={{ width: 100, marginBottom: 8 }} active />
        <Skeleton.Input style={{ width: '100%' }} active />
      </div>
    ))}
    <Space style={{ marginTop: 24 }}>
      <Skeleton.Button active />
      <Skeleton.Button active />
    </Space>
  </Card>
);

/**
 * Skeleton para página de reportes
 */
export const ReportSkeleton = () => (
  <Row gutter={[24, 24]}>
    {[1, 2].map(i => (
      <Col xs={24} lg={12} key={i}>
        <Card>
          <Skeleton 
            active 
            title={{ width: '50%' }}
            paragraph={{ rows: 4 }}
          />
          <Skeleton.Button style={{ width: '100%', marginTop: 24 }} active />
        </Card>
      </Col>
    ))}
  </Row>
);