import React, { useState, createContext, useEffect } from 'react';

export const LazyContext = createContext();

const LazyContextProvider = (props) => {
  const [currentConfig, setCurrentConfig] = useState({});
  const [showCreateConfig, setShowCreateConfig] = useState(false);
  const [scripts, setScripts] = useState([]);
  const [triggerReload, setTriggerReload] = useState(0);
  const [unSaved, setUnSaved] = useState(false);
  const [triggerSave, setTriggerSave] = useState(0);
  const [filterScript, setFilterScript] = useState('all');
  return (
    <LazyContext.Provider
      value={{
        currentConfig,
        setCurrentConfig,
        showCreateConfig,
        setShowCreateConfig,
        scripts,
        setScripts,
        triggerReload,
        setTriggerReload,
        unSaved,
        setUnSaved,
        triggerSave,
        setTriggerSave,
        filterScript,
        setFilterScript,
      }}
    >
      {props.children}
    </LazyContext.Provider>
  );
};

export default LazyContextProvider;
