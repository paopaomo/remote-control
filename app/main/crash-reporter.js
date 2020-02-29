const { crashReporter, app } = require('electron');

const init = () => {
    crashReporter.start({
        productName: app.name,
        submitURL: 'http://127.0.0.1:8888/crash',
        companyName: 'paopaomo'
    });
};

module.exports = { init };
