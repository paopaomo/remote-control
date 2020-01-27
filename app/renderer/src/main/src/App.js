import React, { useState, useEffect, useCallback } from 'react';
import { ipcRenderer } from 'electron';
import { isEmpty } from 'lodash';
import { CONTROL_STATUS } from './consts/controlStatus';
import './App.css';

function App() {
  const [remoteCode, setRemoteCode] = useState('');
  const [localCode, setLocalCode] = useState('');
  const [controlText, setControlText] = useState('');

  const handleControlState = useCallback((e, name, type) => {
      if(type === CONTROL_STATUS.CONTROL) {
          setControlText(`正在远程控制${name}`);
      }
      if(type === CONTROL_STATUS.BE_CONTROLLED) {
          setControlText(`被${name}控制中`);
      }
  }, [setControlText]);

  const login = useCallback(() => {
      ipcRenderer.invoke('login')
          .then(setLocalCode);
  }, [setLocalCode]);

  useEffect(() => {
      login();
      ipcRenderer.on('control-state-change', handleControlState);
      return () => {
          ipcRenderer.removeListener('control-state-change', handleControlState);
      }
  }, [login, handleControlState]);

  const changeRemoteCode = useCallback((e) => {
      setRemoteCode(e.target.value);
  }, [setRemoteCode]);

  const startControl = useCallback(() => {
      ipcRenderer.send('control', remoteCode);
  }, [remoteCode]);

  const renderOperation = (
      <>
          <div>你的控制码{localCode}</div>
          <input type='text' value={remoteCode} onChange={changeRemoteCode} />
          <button onClick={startControl}>确认</button>
      </>
  );

  const renderControlStatus = <div>{controlText}</div>;

  return (
    <div className="App">
      {isEmpty(controlText) ? renderOperation : renderControlStatus}
    </div>
  );
}

export default App;
