import { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { LazyContext } from 'renderer/context/LazyContextProvider';
import ConfigList from './configs/ConfigList';

const Configurations = () => {
  const { currentConfig, setCurrentConfig } = useContext(LazyContext);
  const [configDetail, setConfigDetail] = useState(null);
  useEffect(() => {
    console.log('Found changes in config');
    window.electron.ipcRenderer.once('get-config', (arg) => {
      // eslint-disable-next-line no-console
      setConfigDetail(arg);
    });
    window.electron.ipcRenderer.sendGetConfig(currentConfig.file);
  }, [currentConfig]);

  const renderConfigComponent = (eachInput: object, index: number) => {
    return (
      <>
        <div>{eachInput.name}</div>
        <div>{eachInput.type}</div>
        <div>{eachInput.value}</div>
      </>
    );
  };

  const renderConfigDetail = (configs: []) => {
    return (
      <ListGroup>
        {configs.map((value, index) => renderConfigComponent(value, index))}
      </ListGroup>
    );
  };

  return (
    <Container>
      <Row style={{ marginTop: '8px' }}>
        <h3>Launch Configurations</h3>
      </Row>
      <Row>
        <Col sm={2}>
          <ConfigList />
        </Col>
        <Col sm={10}>
          {configDetail === null ? (
            <>
              <div>Empty</div>
            </>
          ) : (
            renderConfigDetail(configDetail.config)
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Configurations;
