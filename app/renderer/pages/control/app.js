const peer = require('./peer-control');

const play = (stream) => {
  const video = document.getElementById('screen-video');
  video.srcObject = stream;
  video.onloadedmetadata = () => {
    video.play();
  };
};

peer.on('add-stream', play);
