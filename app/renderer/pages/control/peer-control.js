const EventEmitter = require('events');
const { desktopCapturer } = require('electron');

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

module.exports = peer;
