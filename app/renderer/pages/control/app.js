const peer = require('./peer-control');

const video = document.getElementById('screen-video');

const play = (stream) => {
  video.srcObject = stream;
  video.onloadedmetadata = () => {
    video.play();
  };
};

peer.on('add-stream', play);

window.onkeydown = (e) => {
  const { keyCode, shiftKey, metaKey, ctrlKey, altKey } = e;
  peer.emit('robot', 'key',  {
    keyCode,
    shiftKey,
    metaKey,
    ctrlKey,
    altKey
  });
};

window.onmouseup = (e) => {
  const { clientX, clientY } = e;
  peer.emit('robot', 'mouse', {
    clientX,
    clientY,
    video: {
      width: video.getBoundingClientRect().width,
      height: video.getBoundingClientRect().height
    }
  });
};
