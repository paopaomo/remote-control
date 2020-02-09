const EventEmitter = require('events');
const peer = new EventEmitter();

// peer.on('robot', (type, data) => {
//     if(type === 'mouse') {
//         data.screen = {
//             width: window.screen.width,
//             height: window.screen.height
//         }
//     }
//     ipcRenderer.send('robot', type, data);
// });

const peerConnection = new window.RTCPeerConnection({});

peerConnection.onicecandidate = (e) => {
  console.log('candidate', JSON.stringify(e.candidate));
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

window.addIceCandidate = addIceCandidate;

const createOffer = async() => {
    const offer = await peerConnection.createOffer({
        offerToReceiveAudio: false,
        offerToReceiveVideo: true
    });
    await peerConnection.setLocalDescription(offer);
    console.log('offer', JSON.stringify(offer));
    return peerConnection.localDescription;
};

createOffer();

const setRemote = async (answer) => {
    await peerConnection.setRemoteDescription(answer);
};

window.setRemote = setRemote;

peerConnection.onaddstream = (e) => {
    console.log('add-stream', e);
    peer.emit('add-stream', e.stream);
};

module.exports = peer;
