const EventEmitter = require('events');
const { ipcRenderer } = require('electron');
const peer = new EventEmitter();

const peerConnection = new window.RTCPeerConnection({});

const dc = peerConnection.createDataChannel('robotChannel', { reliable: false });

dc.onopen = () => {
    peer.on('robot', (type, data) => {
        dc.send(JSON.stringify({ type, data }));
    });
};

dc.onmessage = (event) => {
  console.log('message', event);
};

dc.onerror = (error) => {
  console.log('error', error);
};

peerConnection.onicecandidate = (e) => {
    console.log('candidate', JSON.stringify(e.candidate));
    if(e.candidate) {
        ipcRenderer.send('forward', 'control-candidate', e.candidate);
    }
};

let candidates = [];

const addIceCandidate = async (candidate) => {
    if(candidate) {
        candidates.push(candidate);
    }
    if(peerConnection.remoteDescription && peerConnection.remoteDescription.type) {
        for(let i = 0; i < candidates.length; i++) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidates[i]));
        }
        candidates = [];
    }
};

const createOffer = async() => {
    const offer = await peerConnection.createOffer({
        offerToReceiveAudio: false,
        offerToReceiveVideo: true
    });
    await peerConnection.setLocalDescription(offer);
    console.log('offer', JSON.stringify(offer));
    return peerConnection.localDescription;
};

const setRemote = async (answer) => {
    await peerConnection.setRemoteDescription(answer);
};

peerConnection.onaddstream = (e) => {
    console.log('add-stream', e);
    peer.emit('add-stream', e.stream);
};

createOffer().then((offer) => {
    ipcRenderer.send('forward', 'offer', { type: offer.type, sdp: offer.sdp });
});

ipcRenderer.on('answer', (e, data) => {
    setRemote(data);
});

ipcRenderer.on('candidate', (e, candidate) => {
    addIceCandidate(candidate);
});

module.exports = peer;
