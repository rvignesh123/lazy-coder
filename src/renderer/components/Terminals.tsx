import React, { useContext, useEffect, useRef } from 'react';
import { Navbar, Nav, Container, Col, Row, Tabs, Tab } from 'react-bootstrap';
import { FaCogs, FaTerminal } from 'react-icons/fa';
import { BsFillTerminalFill } from 'react-icons/bs';
import { XTerm } from 'xterm-for-react';
import { AdventureTime } from 'xterm-theme';
import { LazyContext } from 'renderer/context/LazyContextProvider';
import { FitAddon } from 'xterm-addon-fit';

const Terminals = () => {
  const { tabs, setTabs } = useContext(LazyContext);
  const { activeTab, setActiveTab } = useContext(LazyContext);
  const { currentConfig } = useContext(LazyContext);
  const fitAddon = new FitAddon();
  const xtermRef = useRef(null);

  const write = (line: string) => {
    if (tabs[activeTab]) {
      tabs[activeTab].data += line;
      setTabs(JSON.parse(JSON.stringify(tabs)));
    }
    if (xtermRef) {
      if (xtermRef.current) {
        if (xtermRef.current.terminal) {
          xtermRef.current.terminal.write(line);
        }
      }
    }
  };
  const writeLine = (line: string) => {
    if (xtermRef) {
      if (xtermRef.current) {
        if (xtermRef.current.terminal) {
          xtermRef.current.terminal.writeln(line);
        }
      }
    }
  };

  const initTerminalText = () => {
    if (tabs[activeTab]) {
      writeLine('\u001b[32;1m\nLazyCoder - Terminal v1.0 \u001b[0m');
      writeLine(
        `\u001b[36;1m Configuration: \u001b[0m ${currentConfig.name}\u001b`
      );
      writeLine(`[36;1m Script: \u001b[0m ${currentConfig.script}`);
      writeLine(tabs[activeTab].data);
    }
  };

  useEffect(() => {
    initTerminalText();
  }, [activeTab]);

  useEffect(() => {
    window.electron.ipcRenderer.on('terminal-data', (data) => {
      write(data);
    });
  }, []);

  const showEmptyTerminals = () => {
    return <>You have no terminals open</>;
  };
  const handleTabClick = (event) => {
    const active = parseInt(event.target.getAttribute('data-rr-ui-event-key'));
    if (active >= 0 && active !== activeTab) {
      setActiveTab(active);
      // writeInTerminal();
      // xtermRef.current.terminal.writeln('Hello world');
    }
  };

  const loadTerminal = (tabData, index) => {
    return (
      <Tab eventKey={index} title={tabData.title}>
        {index === activeTab && (
          <XTerm options={{ theme: AdventureTime }} ref={xtermRef} />
        )}
      </Tab>
    );
  };

  const showTerminals = () => {
    return (
      <Tabs
        defaultActiveKey={activeTab}
        id="terminal-tab-parent"
        className="mb-3"
        onClick={handleTabClick}
      >
        {tabs.map(loadTerminal)}
      </Tabs>
    );
  };
  return (
    <Container fluid>
      <Row style={{ marginTop: '8px' }}>
        <Col sm={8}>
          <h3>
            <FaTerminal />
            <span style={{ marginLeft: '15px' }}>Terminals</span>
          </h3>
        </Col>
        <Col sm={4} />
      </Row>
      <Row>{tabs.length !== 0 ? showTerminals() : showEmptyTerminals()}</Row>
    </Container>
  );
};

export default Terminals;
