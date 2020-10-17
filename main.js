// Npm libs
const { app, BrowserWindow, ipcMain } = require('electron');
global.app = app;
global.BrowserWindow = BrowserWindow;
global.ipcMain = ipcMain;

global.fs = require('fs');
global.tmpDir = './tmp';

// Local libs
global.fileScanner = require('./fileScanner');
global.viewBuild = require('./viewBuild');

require('./windowManager');

// Build html file
if(!fs.existsSync(tmpDir)){
	viewBuild();
}

// Init app
function init() {
	global.mainWindow = createWindow('Projet L.U.M.E.N - Learned United Machines of Elanis Network', tmpDir + '/index.html', 1920, 1080);
}

app.on('ready', init);