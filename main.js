// Npm libs
import fs from 'fs';
import path from 'path';

// Local libs
import AppDataManagerFactory from './js/AppDataManager.js';
import ConfigManager from './js/ConfigManager.js';
import fileScanner from './fileScanner.js';
import loadModules from './loadModules.js';
import ModuleDownloader from './moduleDownloader.js';

import './windowManager.js';

function getRandomName() {
	const names = fs.readFileSync('random-names.txt', 'utf8').split('\n');

	return names[Math.floor(Math.random() * (names.length - 1))];
}

export const load = async(electron) => {
	const { app, BrowserWindow, ipcMain } = electron;
	global.app = app;
	global.BrowserWindow = BrowserWindow;
	global.ipcMain = ipcMain;

	global.cssPath = path.resolve(app.getAppPath(), 'css');
	global.modulesPath = path.resolve(app.getAppPath(), 'modules');
	global.tmpDir = path.resolve(app.getAppPath(), 'tmp');
	global.viewsPath = path.resolve(app.getAppPath(), 'views');

	global.AppDataManager = await AppDataManagerFactory(app.getAppPath());
	global.ConfigManager = ConfigManager;
	global.fileScanner = fileScanner;

	await ConfigManager.init();

	// Build html file
	await loadModules();

	// Init app
	global.mainWindow = createWindow(`Projet L.U.M.E.N - ${getRandomName()}`, tmpDir + '/index.html', 1920, 1080);

	app.on('ready', console.log);

	ipcMain.on('app-quit', () => {
		// TODO: save data
		app.quit();
	});
	ipcMain.on('app-restart', () => {
		// TODO: save data
		app.relaunch();
		app.exit();
	});
	ipcMain.on('toggleDevTools', () => {
		BrowserWindow.getFocusedWindow().toggleDevTools();
	});
	ipcMain.handle('getAppPath', () => {
		return app.getAppPath();
	});

	ipcMain.handle('AppDataManager-saveObject', async(e, moduleName, dataName, objectData) => {
		return await AppDataManager.saveObject(moduleName, dataName, objectData);
	});
	ipcMain.handle('AppDataManager-loadObject', async(e, moduleName, dataName,) => {
		return await AppDataManager.loadObject(moduleName, dataName);
	});
	ipcMain.handle('AppDataManager-exists', async(e, moduleName, dataName) => {
		console.log(moduleName, dataName);
		return await AppDataManager.exists(moduleName, dataName);
	});

	ipcMain.handle('ConfigManager-get', (e, moduleName, item) => {
		return ConfigManager.get(moduleName, item);
	});
	ipcMain.handle('ConfigManager-getMetadata', (e, moduleName) => {
		return ConfigManager.getMetadata(moduleName);
	});
	ipcMain.handle('ConfigManager-set', (e, moduleName, item, value) => {
		return ConfigManager.set(moduleName, item, value);
	});

	ipcMain.handle('getModulesList', (e) => {
		return Object.keys(modulesMetaData);
	});

	ipcMain.handle('app-install-module', async(e, moduleData, chosenTag) => {
		await ModuleDownloader.install(moduleData, chosenTag);
	});
};
