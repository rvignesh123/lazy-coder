import React, { useContext, useEffect, useState } from 'react';
import { Navbar, Nav, ListGroup, Form, Col } from 'react-bootstrap';
import { LazyContext } from 'renderer/context/LazyContextProvider';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ConfigList = () => {
  const MySwal = withReactContent(Swal);
  const { currentConfig, setCurrentConfig } = useContext(LazyContext);
  const { triggerReload, setTriggerReload } = useContext(LazyContext);
  const [configList, setConfigList] = useState([]);
  const { unSaved, setUnSaved } = useContext(LazyContext);
  const { filterScript, setFilterScript } = useContext(LazyContext);
  const { triggerSave, setTriggerSave } = useContext(LazyContext);
  const { activeIndex, setActiveIndex } = useContext(LazyContext);
  const handleListClick = (value) => {
    if (!unSaved) {
      setCurrentConfig(value);
    } else {
      MySwal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
      })
        .then((result) => {
          if (result.isConfirmed) {
            setTriggerSave(triggerSave + 1);
          } else if (result.isDenied) {
            setCurrentConfig(value);
            setUnSaved(false);
          }
          return true;
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  useEffect(() => {
    window.electron.ipcRenderer.once('get-config-list', (arg) => {
      setConfigList(arg);
    });
    window.electron.ipcRenderer.sendGetConfigList('all');
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.once('get-config-list', (arg) => {
      setConfigList(arg);
    });
    window.electron.ipcRenderer.sendGetConfigList(filterScript);
  }, [filterScript]);
  useEffect(() => {
    window.electron.ipcRenderer.once('get-config-list', (arg) => {
      setConfigList(arg);
    });
    window.electron.ipcRenderer.sendGetConfigList('all');
  }, [triggerReload]);

  const loadList = (value: Object, index: number) => {
    return (
      <Nav.Item class={activeIndex === index ? 'active-config-item' : ''}>
        <Nav.Link
          eventKey="link-1"
          onClick={() => {
            handleListClick(value);
            setActiveIndex(index);
          }}
        >
          {value.name}
        </Nav.Link>
      </Nav.Item>
    );
  };
  return (
    <Col id="config-list">
      {configList.map((value, index) => loadList(value, index))}
    </Col>
  );
};

export default ConfigList;
