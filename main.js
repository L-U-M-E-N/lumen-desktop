// Npm libs
import path from 'path';

// Local libs
import AppDataManager from './js/AppDataManager.js';
import fileScanner from './fileScanner.js';
import loadModules from './loadModules.js';

import './windowManager.js';

export const load = async(electron) => {
	const { app, BrowserWindow, ipcMain } = electron;
	global.app = app;
	global.BrowserWindow = BrowserWindow;
	global.ipcMain = ipcMain;

	global.cssPath = path.resolve(app.getAppPath(), 'css');
	global.modulesPath = path.resolve(app.getAppPath(), 'modules');
	global.tmpDir = path.resolve(app.getAppPath(), 'tmp');
	global.viewsPath = path.resolve(app.getAppPath(), 'views');

	global.AppDataManager = AppDataManager(app.getAppPath());
	global.fileScanner = fileScanner;

	// Build html file
	await loadModules();

	// Init app
	global.mainWindow = createWindow('Projet L.U.M.E.N - Learned United Machines of Elanis Network', tmpDir + '/index.html', 1920, 1080);

	app.on('ready', console.log);

	ipcMain.on('app-quit', () => {
		app.quit();
	});
	ipcMain.on('toggleDevTools', () => {
		BrowserWindow.getFocusedWindow().toggleDevTools();
	});
	ipcMain.handle('getAppPath', () => {
		return app.getAppPath();
	});
};
