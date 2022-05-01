import { useContext, useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  ListGroup,
  Form,
  Button,
  Nav,
  Tabs,
  Tab,
} from 'react-bootstrap';
import { LazyContext } from 'renderer/context/LazyContextProvider';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FaPlay, FaPlus, FaCogs, FaSave } from 'react-icons/fa';
import DataGrid, { TextEditor } from 'react-data-grid';
import ConfigList from './configs/ConfigList';
import CreateNewConfig from './CreateNewConfig';

const Configurations = () => {
  const MySwal = withReactContent(Swal);
  const { triggerSave, setTriggerSave } = useContext(LazyContext);
  const { currentConfig, setCurrentConfig } = useContext(LazyContext);
  const [configDetail, setConfigDetail] = useState(null);
  const [formData, setFormData] = useState({});
  const { showCreateConfig, setShowCreateConfig } = useContext(LazyContext);
  const { scripts, setScripts } = useContext(LazyContext);
  const { unSaved, setUnSaved } = useContext(LazyContext);
  const { filterScript, setFilterScript } = useContext(LazyContext);
  const [envRows, setEnvRows] = useState([]);

  const assignFormData = (configs: []) => {
    const clonedFormData = {};
    configs.forEach((value) => {
      clonedFormData[value.name] = value.value ? value.value : '';
    });
    setFormData(clonedFormData);
  };

  const assignEnvironment = (environment: {}) => {
    if (!environment) {
      return;
    }
    const rows: Array = [];
    Object.keys(environment).forEach((key) => {
      rows.push({
        name: key,
        value: environment[key],
      });
    });
    setEnvRows(rows);
  };

  const savableEnvironment = (environment: []) => {
    if (!environment) {
      return {};
    }
    const result: Object = {};
    environment.forEach((row) => {
      result[row.name] = result[row.value];
    });
    return result;
  };

  useEffect(() => {
    console.log('Found changes in config');
    window.electron.ipcRenderer.once('get-config', (arg) => {
      // eslint-disable-next-line no-console
      assignFormData(arg.config);
      assignEnvironment(arg.environment);
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
    if (!unSaved) {
      return;
    }
    if (JSON.stringify(formData) == '{}') {
      return;
    }
    const request = {
      currentConfig,
      formData,
      environment: savableEnvironment(envRows),
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

  const handleAddRow = () => {
    const rows = JSON.parse(JSON.stringify(envRows));
    rows.push({ name: '', value: '' });
    setEnvRows(rows);
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

  const showSaveChange = (callback: Function) => {
    MySwal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    })
      .then((result) => {
        return callback(result);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleCreateNew = () => {
    if (unSaved) {
      showSaveChange((result) => {
        if (result.isConfirmed) {
          handleSubmit();
          setShowCreateConfig(true);
        } else if (result.isDenied) {
          setUnSaved(false);
          setShowCreateConfig(true);
        }
        return true;
      });
    } else {
      setShowCreateConfig(true);
    }
  };

  const handleScriptSelect = (e) => {
    setFilterScript(e.target.value);
  };
  useEffect(() => {
    handleSubmit();
  }, [triggerSave]);

  const createOptions = (value: Object, index: number) => {
    return (
      <>
        <option value={value.name}>{value.name}</option>
      </>
    );
  };

  const columns = [
    { key: 'name', name: 'Variable Name', editor: TextEditor, resizable: true },
    { key: 'value', name: 'Value', editor: TextEditor, resizable: true },
  ];

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
              style={{ width: '39px', height: '39px', marginRight: '8px' }}
              variant="light"
              onClick={handleCreateNew}
            >
              <FaPlus />
            </Button>
            <Button
              style={{ width: '39px', height: '39px', marginRight: '8px' }}
              variant="success"
            >
              <FaPlay />
            </Button>
            <Button
              style={{ width: '39px', height: '39px' }}
              variant="primary"
              onClick={handleSubmit}
            >
              <FaSave />
            </Button>
          </Row>
        </Col>
      </Row>
      <Row style={{ marginTop: '12px' }}>
        <Col sm={3}>
          <Form.Group className="mb-3" controlId="scriptSelect">
            <Form.Select
              aria-label="Script Filter"
              value={filterScript}
              onChange={handleScriptSelect}
            >
              <option value="all">All</option>
              {scripts.map((value, index) => createOptions(value, index))}
            </Form.Select>
          </Form.Group>
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
              <Tabs
                defaultActiveKey="inputs"
                id="uncontrolled-tab-example"
                className="mb-3"
              >
                <Tab eventKey="inputs" title="Inputs">
                  {renderConfigDetail(configDetail.config)}
                  <Button variant="primary" onClick={handleSubmit}>
                    Save
                  </Button>
                </Tab>
                <Tab eventKey="envvars" title="Environment Variables">
                  <Button
                    style={{
                      width: '39px',
                      height: '39px',
                      marginRight: '12px',
                    }}
                    variant="light"
                    onClick={handleAddRow}
                  >
                    <FaPlus />
                  </Button>
                  <DataGrid
                    columns={columns}
                    rows={envRows}
                    onRowsChange={setEnvRows}
                  />
                </Tab>
              </Tabs>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Configurations;
