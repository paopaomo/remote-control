const EventEmitter = require('events');
const { desktopCapturer, ipcRenderer } = require('electron');

const peer = new EventEmitter();

const getScreenStream = () => {
    desktopCapturer.getSources({ types: ['screen'] }).then(sources => {
        navigator.webkitGetUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: sources[0].id,
                    maxWidth: window.screen.width,
                    maxHeight: window.screen.height
                }
            }
        }, (stream) => {
            peer.emit('add-stream', stream);
        }, (err) => {
            console.error(err);
        })
    });
};

getScreenStream();

peer.on('robot', (type, data) => {
    if(type === 'mouse') {
        data.screen = {
            width: window.screen.width,
            height: window.screen.height
        }
    }
    ipcRenderer.send('robot', type, data);
});

module.exports = peer;
