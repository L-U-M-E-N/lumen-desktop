// Npm libs
const { app, BrowserWindow, ipcMain } = require('electron');
global.app = app;
global.BrowserWindow = BrowserWindow;
global.ipcMain = ipcMain;

global.fs = require('fs');
const path = require('path');

global.cssPath = path.resolve(app.getAppPath(), 'css');
global.modulesPath = path.resolve(app.getAppPath(), 'modules');
global.tmpDir = path.resolve(app.getAppPath(), 'tmp');
global.viewsPath = path.resolve(app.getAppPath(), 'views');

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

ipcMain.on('app-quit', () => {
	app.quit();
});