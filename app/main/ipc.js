const { ipcMain } = require('electron');
const { CONTROL_STATUS } = require('./consts/controlStatus');
const { sendMainWindow } = require('./windows/main');
const { createControlWindow, sendControlWindow } = require('./windows/control');
const signal = require('./signal');

module.exports = () => {
    ipcMain.handle('login', async () => {
        const { code } = await signal.invoke('login', null, 'logined');
        return code;
    });
    ipcMain.on('control', async(e, remoteCode) => {
        await signal.invoke('control', { remote: remoteCode });
    });
    signal.on('controlled', (data) => {
        sendMainWindow('control-state-change', data.remote, CONTROL_STATUS.CONTROL);
        createControlWindow();
    });
    signal.on('be-controlled', (data) => {
        sendMainWindow('control-state-change', data.remote, CONTROL_STATUS.BE_CONTROLLED);
    });
    ipcMain.on('forward', (e, event, data) => {
        signal.send('forward', { event, data });
    });
    signal.on('offer', (data) => {
        sendMainWindow('offer', data);
    });
    signal.on('answer', (data) => {
        sendControlWindow('answer', data);
    });
    signal.on('puppet-candidate', (data) => {
        sendControlWindow('candidate', data);
    });
    signal.on('control-candidate', (data) => {
        sendMainWindow('candidate', data);
    });
};
