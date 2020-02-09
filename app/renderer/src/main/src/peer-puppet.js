import { desktopCapturer } from 'electron';

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

const createAnswer = async (offer) => {
    const screenStream = await getScreenStream();
    peerConnection.addStream(screenStream);
    await peerConnection.setRemoteDescription(offer);
    await peerConnection.setLocalDescription(await peerConnection.createAnswer());
    console.log('answer', JSON.stringify(peerConnection.localDescription));
    return peerConnection.localDescription;
};

window.createAnswer = createAnswer;
