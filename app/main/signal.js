const WebSocket = require('ws');
const EventEmitter = require('events');

const signal = new EventEmitter();

const ws = new WebSocket('ws://192.168.0.100:8010');

ws.on('open', () => {
    console.log('connect success');
});

ws.on('message', (message) => {
    let data = {};
    try {
        data = JSON.parse(message);
    } catch(e) {
        console.log('parse error', e);
    }
    signal.emit(data.event, data.data);
});

const send = (event, data) => {
    ws.send(JSON.stringify({ event, data }));
};

const invoke = (event, data, answerEvent) => {
    return new Promise((resolve, reject) => {
        send(event, data);
        signal.once(answerEvent, resolve);
        setTimeout(() => {
            reject('timeout');
        }, 5000);
    });
};

signal.send = send;
signal.invoke = invoke;

module.exports = signal;

