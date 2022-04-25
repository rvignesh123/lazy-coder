import React, { useContext, useEffect, useState } from 'react';
import { Navbar, Nav, ListGroup } from 'react-bootstrap';
import { LazyContext } from 'renderer/context/LazyContextProvider';

const ConfigList = () => {
  const { currentConfig, setCurrentConfig } = useContext(LazyContext);
  const [configList, setConfigList] = useState([]);
  useEffect(() => {
    window.electron.ipcRenderer.once('get-config-list', (arg) => {
      // eslint-disable-next-line no-console
      setConfigList(arg);
      setCurrentConfig(arg[0]);
    });
    window.electron.ipcRenderer.sendGetConfigList('all');
  }, []);
  const loadList = (value: Object, index: number) => {
    return (
      <ListGroup>
        <ListGroup.Item>{value.name}</ListGroup.Item>
      </ListGroup>
    );
  };
  return <>{configList.map((value, index) => loadList(value, index))}</>;
};

export default ConfigList;
