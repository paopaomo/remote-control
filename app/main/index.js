const { app } = require('electron');
const handleIPC = require('./ipc');
const { createMainWindow } = require('./windows/main');

app.on('ready', () => {
    createMainWindow();
    handleIPC();
});
