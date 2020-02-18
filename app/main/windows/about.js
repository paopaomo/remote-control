const openAboutWindow = require('electron-about-window').default;
const path = require('path');

const create = () => openAboutWindow({
    icon_path: path.join(__dirname, 'icon.png'),
    package_json_dir: path.resolve(__dirname, '../../../'),
    copyright: 'Copyright (c) 2020 Zi Ye',
    homepage: 'https://github.com/paopaomo/remote-control'
});

module.exports = { create };
