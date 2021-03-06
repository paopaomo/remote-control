import { desktopCapturer, ipcRenderer } from 'electron';

const getScreenStream = async () => {
    const sources = await desktopCapturer.getSources({ types: ['screen'] });
    return new Promise((resolve, reject) => {
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
            resolve(stream);
        }, (err) => {
            console.error(err);
            reject(err);
        })
    });
};

const peerConnection = new window.RTCPeerConnection({});

peerConnection.ondatachannel = (e) => {
    console.log('datachannel', e);
    e.channel.onmessage = (e) => {
        try {
            const { type, data } = JSON.parse(e.data);
            if(type === 'mouse') {
                data.screen = {
                    width: window.screen.width,
                    height: window.screen.height
                }
            }
            ipcRenderer.send('robot', type, data);
        } catch(e) {
            console.error(e);
        }
    }
};

peerConnection.onicecandidate = (e) => {
    console.log('candidate', JSON.stringify(e.candidate));
    if(e.candidate) {
        ipcRenderer.send('forward', 'puppet-candidate', JSON.stringify(e.candidate));
    }
};

const createAnswer = async (offer) => {
    const screenStream = await getScreenStream();
    peerConnection.addStream(screenStream);
    await peerConnection.setRemoteDescription(offer);
    await peerConnection.setLocalDescription(await peerConnection.createAnswer());
    console.log('answer', JSON.stringify(peerConnection.localDescription));
    return peerConnection.localDescription;
};

let candidates = [];

const addIceCandidate = async (candidate) => {
    if(candidate) {
        candidates.push(candidate);
    }
    if(peerConnection.remoteDescription && peerConnection.remoteDescription.type) {
        for(let i = 0; i < candidates.length; i++) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(JSON.parse(candidates[i])));
        }
        candidates = [];
    }
};

ipcRenderer.on('offer', async(e, offer) => {
    const answer = await createAnswer(offer);
    ipcRenderer.send('forward', 'answer', { type: answer.type, sdp: answer.sdp });
});

ipcRenderer.on('candidate', (e, candidate) => {
    addIceCandidate(candidate);
});
