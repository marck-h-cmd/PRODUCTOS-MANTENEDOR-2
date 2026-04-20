import React from 'react';
import { Result, Button } from 'antd';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
    
    // Aquí se podría enviar a un servicio de monitoreo como Sentry
  }

  handleReset = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    // Recargar la página si es necesario
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="Algo salió mal"
          subTitle="Ha ocurrido un error inesperado en la aplicación."
          extra={[
            <Button key="reset" onClick={this.handleReset}>
              Intentar de nuevo
            </Button>,
            <Button key="reload" type="primary" onClick={this.handleReload}>
              Recargar página
            </Button>
          ]}
        >
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div style={{ 
              marginTop: 20, 
              padding: 16, 
              background: '#f5f5f5', 
              borderRadius: 8,
              textAlign: 'left',
              maxHeight: 300,
              overflow: 'auto'
            }}>
              <pre style={{ fontSize: 12 }}>
                {this.state.error.toString()}
                {'\n'}
                {this.state.errorInfo?.componentStack}
              </pre>
            </div>
          )}
        </Result>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;