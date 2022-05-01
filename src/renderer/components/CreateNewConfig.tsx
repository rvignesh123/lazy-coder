import React, { useContext, useEffect, useState } from 'react';
import {
  Navbar,
  Nav,
  ListGroup,
  Modal,
  Button,
  Form,
  Alert,
} from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { LazyContext } from 'renderer/context/LazyContextProvider';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const CreateNewConfig = () => {
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const { showCreateConfig, setShowCreateConfig } = useContext(LazyContext);
  const [validated, setValidated] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [scriptIndex, setScriptIndex] = useState<number>(0);
  const [status, setStatus] = useState(true);
  const { scripts, setScripts } = useContext(LazyContext);
  const { triggerReload, setTriggerReload } = useContext(LazyContext);
  const handleNameChange = (e) => {
    console.log(e.target.value);
    setName(e.target.value);
  };
  const handleScriptSelect = (e) => {
    setScriptIndex(e.target.value);
  };
  const handleClose = () => setShowCreateConfig(false);
  const handleShow = () => setShowCreateConfig(true);
  const createOptions = (value: Object, index: number) => {
    return (
      <>
        <option value={index}>{value.name}</option>
      </>
    );
  };
  const handleSubmit = (event) => {
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
    const request = {
      name,
      config: scripts[scriptIndex].config,
      script: scripts[scriptIndex].name,
    };
    if (!request.config) {
      request.config = scripts[0].config;
    }

    window.electron.ipcRenderer.once('create-config', (saveStatus) => {
      setStatus(saveStatus);
      if (saveStatus) {
        handleClose();
        setStatus(true);
        setName('');
        setScriptIndex(0);
        setTriggerReload(triggerReload + 1);
      }
    });
    window.electron.ipcRenderer.createConfigIpc(request);
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Modal show={showCreateConfig} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Configuration</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="scriptSelect">
            <Form.Label>Select Script</Form.Label>
            <Form.Select
              aria-label="Default select example"
              value={scriptIndex}
              onChange={handleScriptSelect}
            >
              {scripts.map((value, index) => createOptions(value, index))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="configName">
            <Form.Label>Configuration Name</Form.Label>
            <Form.Control
              required
              type="input"
              placeholder="Eg. Dev-Project Script"
              value={name}
              onChange={handleNameChange}
            />
            <Form.Control.Feedback type="invalid">
              Name is required
            </Form.Control.Feedback>
          </Form.Group>
          {!status && (
            <Alert key="danger" variant="danger">
              Invalid file name or config already exists
            </Alert>
          )}
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateNewConfig;
