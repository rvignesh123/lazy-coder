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
  Tooltip,
  OverlayTrigger,
} from 'react-bootstrap';
import { LazyContext } from 'renderer/context/LazyContextProvider';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
  FaPlay,
  FaPlus,
  FaCogs,
  FaSave,
  FaCopy,
  FaTrash,
  FaCog,
} from 'react-icons/fa';
import { GiBison, GiBuffaloHead } from 'react-icons/gi';
import DataGrid, { TextEditor } from 'react-data-grid';
import ReactTooltip from 'react-tooltip';
import { useNavigate } from 'react-router';
import ConfigList from './configs/ConfigList';
import CreateNewConfig from './CreateNewConfig';
import NotFound from '../../../assets/NotFound.png';

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
  const [enableEdit, setEnableEdit] = useState(false);
  const { triggerReload, setTriggerReload } = useContext(LazyContext);
  const { tabs, setTabs } = useContext(LazyContext);
  const { activeTab, setActiveTab } = useContext(LazyContext);
  const navigate = useNavigate();

  const savableEnvironment = (environment: []) => {
    if (!environment) {
      return {};
    }
    const result: Object = {};
    environment.forEach((row) => {
      result[row.name] = row.value;
    });
    return result;
  };

  const startProcess = () => {
    const request = {
      currentConfig,
      formData,
      environment: savableEnvironment(envRows),
    };
    window.electron.ipcRenderer.startProcess(request);
  };

  const createTerminalTab = (tabData) => {
    tabs.push(tabData);
    setTabs(tabs);
    setActiveTab(tabs.length - 1);
    startProcess();
    navigate('/');
  };

  const handlePlayEvent = () => {
    if (configDetail) {
      createTerminalTab({
        title: currentConfig.name,
        data: '',
      });
    } else {
      MySwal.fire('Please choose a config to Run', '', 'info');
    }
  };
  const assignFormData = (configs: []) => {
    const clonedFormData = {};
    configs.forEach((value) => {
      clonedFormData[value.name] = value.value ? value.value : '';
    });
    setFormData(clonedFormData);
  };

  const assignEnvironment = (environment: {}) => {
    if (!environment) {
      setEnvRows([]);
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

  useEffect(() => {
    console.log('Found changes in config');
    window.electron.ipcRenderer.once('get-config', (arg) => {
      // eslint-disable-next-line no-console
      assignFormData(arg.config);
      assignEnvironment(arg.environment);
      setConfigDetail(arg);
      setEnableEdit(true);
    });
    window.electron.ipcRenderer.sendGetConfig(currentConfig.file);
  }, [currentConfig]);

  useEffect(() => {
    window.electron.ipcRenderer.once('get-scripts', (arg) => {
      // eslint-disable-next-line no-console
      setScripts(arg);
    });
    window.electron.ipcRenderer.sendGetScripts();
  }, []);

  const handleSubmit = () => {
    if (Object.keys(formData).length === 0) {
      return;
    }
    if (!unSaved) {
      MySwal.fire('No Changes to save', '', 'info');
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
      <Container fluid>
        <Row>
          <img
            src={NotFound}
            style={{ width: '400px', height: '320px', margin: 'auto' }}
          />
          <h6 style={{ color: 'grey', textAlign: 'center' }}>
            Please choose any configuration or you can create new
          </h6>
        </Row>
        <Row>
          <Button
            variant="primary"
            onClick={() => {
              setShowCreateConfig(true);
            }}
            style={{ width: '240px', margin: 'auto' }}
          >
            Create New Configuration
          </Button>
        </Row>
      </Container>
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

  const renderTooltip = (props) => {
    return <Tooltip id="button-tooltip">Simple tooltip</Tooltip>;
  };
  const sendCopyConfig = (name) => {
    const request = JSON.parse(JSON.stringify(currentConfig));
    request.newName = name;
    window.electron.ipcRenderer.once('copy-config', (status) => {
      if (status) {
        MySwal.fire('Copied!', '', 'success');
        setTriggerReload(triggerReload + 1);
      } else {
        MySwal.fire('Error!', 'Invalid name or name already exists', 'error');
      }
    });
    window.electron.ipcRenderer.sendCopyConfig(request);
  };
  const copyConfig = () => {
    if (!configDetail) {
      MySwal.fire('Choose a configuration to copy', '', 'info');
      return;
    }
    MySwal.fire({
      title: 'Copy Configuration',
      input: 'text',
      inputLabel: 'Config new name',
      inputPlaceholder: 'Enter new configuration name',
      inputValue: `${currentConfig.name}-Copy`,
    })
      .then((result) => {
        if (result.isConfirmed) {
          sendCopyConfig(result.value);
        }
        return result;
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleCopyConfig = () => {
    if (unSaved) {
      showSaveChange((result) => {
        if (result.isConfirmed) {
          handleSubmit();
          copyConfig();
        } else if (result.isDenied) {
          setUnSaved(false);
          copyConfig();
        }
        return true;
      });
    } else {
      copyConfig();
    }
  };

  const handleDelete = () => {
    if (!configDetail) {
      MySwal.fire('Choose a configuration to delete', '', 'info');
      return;
    }
    MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#0b5ed7',
      confirmButtonText: 'Yes, delete it!',
    })
      .then((result) => {
        if (result.isConfirmed) {
          window.electron.ipcRenderer.once('delete-config', (status) => {
            if (status) {
              MySwal.fire('Deleted!', 'Your file has been deleted.', 'success');
              setTriggerReload(triggerReload + 1);
              setConfigDetail(null);
            } else {
              MySwal.fire('Error!', 'Unable to delete', 'error');
            }
          });
          window.electron.ipcRenderer.sendDeleteConfig(currentConfig);
        }
        return result;
      })
      .catch((e) => {
        console.log(e);
      });
  };

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
              variant="secondary"
              id="createNew"
              onClick={handleCreateNew}
            >
              <FaPlus />
            </Button>
            <Button
              style={{ width: '39px', height: '39px', marginRight: '8px' }}
              variant="secondary"
              disabled={!enableEdit}
              onClick={handleCopyConfig}
            >
              <FaCopy />
            </Button>
            <Button
              style={{ width: '39px', height: '39px', marginRight: '8px' }}
              variant="secondary"
              disabled={!enableEdit}
              onClick={handleDelete}
            >
              <FaTrash />
            </Button>
            <Button
              style={{ width: '39px', height: '39px', marginRight: '8px' }}
              variant="success"
              onClick={handlePlayEvent}
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
                <FaCog
                  style={{
                    fontSize: '16px',
                    marginRight: '8px',
                    fontStyle: 'italic',
                  }}
                />
                {currentConfig.name}
                <span
                  style={{
                    fontSize: '16px',
                    marginLeft: '8px',
                    fontStyle: 'italic',
                  }}
                >
                  ({currentConfig.script})
                </span>
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
                    style={{ height: 'calc(100vh - 280px)' }}
                    columns={columns}
                    rows={envRows}
                    onRowsChange={(event) => {
                      console.log(event);
                      setEnvRows(event);
                      setUnSaved(true);
                    }}
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
