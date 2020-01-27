const { override } = require('customize-cra');

const addRendererTarget = (config) => {
    config.target = 'electron-renderer';
    return config;
};

module.exports = override(addRendererTarget);
