import React, { useState, useEffect, useCallback } from 'react';
import { ipcRenderer, remote } from 'electron';
import { isEmpty } from 'lodash';
import { CONTROL_STATUS } from './consts/controlStatus';
import './peer-puppet.js';
import './App.css';

const { Menu, MenuItem } = remote;

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
  }, []);

  const changeRemoteCode = useCallback((e) => {
      setRemoteCode(e.target.value);
  }, [setRemoteCode]);

  const startControl = useCallback(() => {
      ipcRenderer.send('control', remoteCode);
  }, [remoteCode]);

  const handleContextMenu = useCallback((e) => {
      e.preventDefault();
      const menu = new Menu();
      menu.append(new MenuItem({
          label: '复制',
          role: 'copy'
      }));
      menu.popup();
  }, []);

  const renderOperation = (
      <>
          <div className='title'>
              <span>本机识别码:</span>
              <span className='code' onContextMenu={handleContextMenu}>{localCode}</span>
          </div>
          <div className='tip'>
              请发送识别码给小伙伴用来控制本机
          </div>
          <div className='operation'>
              <input type='text' value={remoteCode} onChange={changeRemoteCode} />
              <button onClick={startControl}>远程协助</button>
          </div>
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
