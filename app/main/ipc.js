const { ipcMain } = require('electron');
const { CONTROL_STATUS } = require('./consts/controlStatus');
const { sendMainWindow } = require('./windows/main');
const { createControlWindow } = require('./windows/control');

module.exports = () => {
    ipcMain.handle('login', () => {
        // mock, return code
        const code = Math.floor(Math.random() * (999999 - 100000)) + 10000;
        return Promise.resolve(code);
    });
    ipcMain.on('control', (e, remoteCode) => {
        // server interaction
        sendMainWindow('control-state-change', remoteCode, CONTROL_STATUS.CONTROL);
        createControlWindow();
    });
};
