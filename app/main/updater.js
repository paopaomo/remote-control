const { autoUpdater, app, dialog } = require('electron');

if(process.platform === 'darwin') {
    autoUpdater.setFeedURL(`http://127.0.0.1:8888/remote-control/releases/darwin?version=${app.getVersion()}`);
} else {
    // todo
}

autoUpdater.checkForUpdates(); // 定时轮询,服务端推送
autoUpdater.on('update-available', () => {
    console.log('update-available');
});
autoUpdater.on('update-downloaded', () => {
    // 提醒用户更新
    app.whenReady().then(() => {
        const clickId = dialog.showMessageBoxSync({
            type: 'info',
            title: '升级提示',
            message: '已为您升级到最新版,是否立即体验',
            buttons: ['马上体验', '手动重启'],
            cancelId: 1
        });
        if(clickId === 0) {
            autoUpdater.quitAndInstall();
        }
    });
});

autoUpdater.on('error', (error) => {
    console.log('error', error);
});

