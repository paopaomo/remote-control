const { BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');

let win;

const createMainWindow = () => {
    win = new BrowserWindow({
        width: 500,
        height: 300,
        webPreferences: {
            nodeIntegration: true
        }
    });
    if(isDev) {
        win.loadURL('http://localhost:3000');
    } else {
        win.loadFile(path.resolve(__dirname, '../../renderer/pages/main/index.html'));
    }
};

const sendMainWindow = (channel, ...args) => {
    win.webContents.send(channel, ...args);
};

module.exports = { createMainWindow, sendMainWindow };
