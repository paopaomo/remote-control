const { app } = require('electron');
const handleIPC = require('./ipc');
const { createMainWindow } = require('./windows/main');
const robotControl = require('./robot');

app.on('ready', () => {
    createMainWindow();
    handleIPC();
    robotControl();
});
