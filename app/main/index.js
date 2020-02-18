const { app } = require('electron');
const handleIPC = require('./ipc');
const { createMainWindow, showMainWindow, closeMainWindow } = require('./windows/main');
const robotControl = require('./robot');

const gotTheLock = app.requestSingleInstanceLock();

if(!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        showMainWindow();
    });

    app.on('ready', () => {
        createMainWindow();
        handleIPC();
        robotControl();
    });

    app.on('before-quit', () => {
        closeMainWindow();
    });

    app.on('activate', () => {
        showMainWindow();
    });
}
