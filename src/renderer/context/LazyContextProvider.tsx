import React, { useState, createContext, useEffect } from 'react';

export const LazyContext = createContext();

const LazyContextProvider = (props) => {
  const [currentConfig, setCurrentConfig] = useState({});
  return (
    <LazyContext.Provider
      value={{
        currentConfig,
        setCurrentConfig,
      }}
    >
      {props.children}
    </LazyContext.Provider>
  );
};

export default LazyContextProvider;
