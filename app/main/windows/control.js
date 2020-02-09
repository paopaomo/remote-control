const { BrowserWindow } = require('electron');
const path = require('path');

let win;

const createControlWindow = () => {
    win = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.loadFile(path.resolve(__dirname, '../../renderer/pages/control/index.html'));
};

const sendControlWindow = (channel, ...args) => {
    win.webContents.send(channel, ...args);
};

module.exports = { createControlWindow, sendControlWindow };
