const { app, Menu, Tray } = require('electron');
const path = require('path');
const { showMainWindow } = require('../windows/main');
const { create: createAboutWindow } = require('../windows/about');

let tray;

const setTray = () => {
    tray = new Tray(path.resolve(__dirname, './icon_darwin.png'));
    tray.on('click', () => {
        showMainWindow();
    });
    tray.on('right-click', () => {
        const contextMenu = Menu.buildFromTemplate([
            {
                label: '显示',
                click: showMainWindow
            },
            {
                label: '退出',
                click: app.quit
            }
        ]);
        tray.popUpContextMenu(contextMenu);
    });
};

const setAppMenu = () => {
    const appMenu = Menu.buildFromTemplate([
        {
            label: app.name,
            submenu: [
                {
                    label: 'About',
                    click: createAboutWindow
                },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideothers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        },
        { role: 'fileMenu' },
        { role: 'windowMenu' },
        { role: 'editMenu' }
    ]);
    app.applicationMenu = appMenu;
};

setTray();
setAppMenu();
