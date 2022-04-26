import { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, ListGroup, Form, Button } from 'react-bootstrap';
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
        <Form.Group className="mb-3" controlId={eachInput.name}>
          <Form.Label>{eachInput.title}</Form.Label>
          <Form.Control
            type={eachInput.type}
            placeholder={eachInput.placeHolder}
            value={eachInput.value}
          />
        </Form.Group>
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
            <>
              <Form>
                {renderConfigDetail(configDetail.config)}
                <Button variant="primary" type="submit">
                  Save
                </Button>
              </Form>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Configurations;
