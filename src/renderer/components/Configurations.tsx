import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useDebugValue, useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  ListGroup,
  Form,
  Button,
  Nav,
} from 'react-bootstrap';
import { LazyContext } from 'renderer/context/LazyContextProvider';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { BsFillPlayFill } from 'react-icons/bs';
import { FaSave, FaPlay, FaPlus, FaCogs } from 'react-icons/fa';
import ConfigList from './configs/ConfigList';
import CreateNewConfig from './CreateNewConfig';

const Configurations = () => {
  const MySwal = withReactContent(Swal);
  const { triggerSave, setTriggerSave } = useContext(LazyContext);
  const myIcon: IconName = 'play';
  const { currentConfig, setCurrentConfig } = useContext(LazyContext);
  const [configDetail, setConfigDetail] = useState(null);
  const [formData, setFormData] = useState({});
  const { showCreateConfig, setShowCreateConfig } = useContext(LazyContext);
  const { scripts, setScripts } = useContext(LazyContext);
  const { unSaved, setUnSaved } = useContext(LazyContext);

  const assignFormData = (configs: []) => {
    const clonedFormData = {};
    configs.forEach((value) => {
      clonedFormData[value.name] = value.value ? value.value : '';
    });
    setFormData(clonedFormData);
  };

  useEffect(() => {
    console.log('Found changes in config');
    window.electron.ipcRenderer.once('get-config', (arg) => {
      // eslint-disable-next-line no-console
      assignFormData(arg.config);
      setConfigDetail(arg);
    });
    window.electron.ipcRenderer.sendGetConfig(currentConfig.file);
  }, [currentConfig]);

  useEffect(() => {
    window.electron.ipcRenderer.once('get-scripts', (arg) => {
      // eslint-disable-next-line no-console
      setScripts(arg);
      console.log(arg);
    });
    window.electron.ipcRenderer.sendGetScripts();
  }, []);

  const handleSubmit = () => {
    if (JSON.stringify(formData) == '{}') {
      return;
    }
    const request = {
      currentConfig,
      formData,
    };
    window.electron.ipcRenderer.once('save-config', (status) => {
      if (status) {
        MySwal.fire('Saved!', '', 'success');
        setUnSaved(false);
      } else {
        MySwal.fire('Error on Saving!', '', 'error');
      }
    });
    window.electron.ipcRenderer.sendSaveConfigDetail(request);
  };

  const renderConfigComponent = (eachInput: object, index: number) => {
    return (
      <>
        <Form.Group className="mb-3" controlId={eachInput.name}>
          <Form.Label>{eachInput.title}</Form.Label>
          <Form.Control
            type={eachInput.type}
            value={formData[eachInput.name]}
            onChange={(e) => {
              const clonedFormData = JSON.parse(JSON.stringify(formData));
              clonedFormData[e.target.id] = e.target.value;
              setFormData(clonedFormData);
              setUnSaved(true);
            }}
            placeholder={eachInput.placeHolder}
          />
        </Form.Group>
      </>
    );
  };

  const showEmptyConfig = () => {
    return (
      <>
        <Button
          variant="primary"
          onClick={() => {
            setShowCreateConfig(true);
          }}
        >
          Create New Configuration
        </Button>
      </>
    );
  };
  const renderConfigDetail = (configs: []) => {
    return (
      <ListGroup>
        <Form>
          {configs.map((value, index) => renderConfigComponent(value, index))}
        </Form>
      </ListGroup>
    );
  };

  useEffect(() => {
    handleSubmit();
  }, [triggerSave]);

  return (
    <Container fluid>
      <CreateNewConfig />
      <Row style={{ marginTop: '8px' }}>
        <Col sm={8}>
          <h3>
            <FaCogs />
            <span style={{ marginLeft: '15px' }}>Launch Configurations</span>
          </h3>
        </Col>
        <Col sm={4}>
          <Row
            className="pull-right"
            style={{ float: 'right', marginRight: '12px' }}
          >
            <Button
              style={{ width: '39px', height: '39px', marginRight: '12px' }}
              variant="light"
            >
              <FaPlus />
            </Button>
            <Button style={{ width: '39px', height: '39px' }} variant="success">
              <FaPlay />
            </Button>
          </Row>
        </Col>
      </Row>
      <Row style={{ marginTop: '12px' }}>
        <Col sm={3}>
          <ConfigList />
        </Col>
        <Col sm={9}>
          {configDetail === null ? (
            showEmptyConfig()
          ) : (
            <>
              <h4>
                {currentConfig.name}
                {unSaved && <span style={{ color: 'red' }}> *</span>}
              </h4>
              {renderConfigDetail(configDetail.config)}
              <Button variant="primary" onClick={handleSubmit}>
                Save
              </Button>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Configurations;
