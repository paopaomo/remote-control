const { ipcMain } = require('electron');
const robot = require('robotjs');
const vkey = require('vkey');

const handleMouse = (data) => {
    // data { clientX, clientY, screen: { width, height }, video: { width, height } }
    const { clientX, clientY, screen, video } = data;
    const x = clientX * screen.width / video.width;
    const y = clientY * screen.height / video.height;
    robot.moveMouse(x, y);
    robot.mouseClick();
};

const handleKey = (data) => {
    // data { keyCode, meta, alt, ctrl, shift }
    const modifiers = [];
    const { meta, alt, ctrl, shift, keyCode } = data;
    if(meta) {
        modifiers.push('meta');
    }
    if(alt) {
        modifiers.push('alt');
    }
    if(ctrl) {
        modifiers.push('ctrl');
    }
    if(shift) {
        modifiers.push('shift');
    }
    const key = vkey[keyCode].toLowerCase();
    // special characters or not, for example <shift>
    if(key[0] !== '<') {
        robot.keyTap(key, modifiers);
    }
};

module.exports = () => {
    ipcMain.on('robot', (e, type, data) => {
        if(type === 'mouse') {
            handleMouse(data);
        }
        if(type === 'key') {
            handleKey(data);
        }
    });
};
