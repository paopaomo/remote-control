const { BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');

let win;
let willQuitApp = false;

const createMainWindow = () => {
    win = new BrowserWindow({
        width: 500,
        height: 300,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.on('close', (e) => {
        if(willQuitApp) {
            win = null;
        } else {
            e.preventDefault();
            win.hide();
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

const showMainWindow = () => {
    win.show();
};

const closeMainWindow = () => {
    willQuitApp = true;
};

module.exports = { createMainWindow, sendMainWindow, showMainWindow, closeMainWindow };
