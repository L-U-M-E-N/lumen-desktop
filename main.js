// Npm libs
const { app, BrowserWindow, ipcMain } = require('electron');
global.app = app;
global.BrowserWindow = BrowserWindow;
global.ipcMain = ipcMain;

global.fs = require('fs');
global.tmpDir = './tmp';

// Local libs
global.AppDataManager = require('./js/AppDataManager')(app);
global.fileScanner = require('./fileScanner');
global.loadModules = require('./loadModules');

require('./windowManager');

// Build html file
loadModules();

// Init app
function init() {
	global.mainWindow = createWindow('Projet L.U.M.E.N - Learned United Machines of Elanis Network', tmpDir + '/index.html', 1920, 1080);
}

app.on('ready', init);