window.ipcRenderer = require('electron').ipcRenderer;

window.addEventListener('load', () => {
	document.addEventListener('keydown', (e) => {
		if (e.which === 116) { // F5
			window.location.reload();
		}

		if (e.which === 123) { // F12
			ipcRenderer.send('toggleDevTools');
		}
	});

	for(const img of document.querySelectorAll('.sidebar img')) {
		let pageLink = '';
		if(img.id === 'home') {
			pageLink = '/tmp/index.html';
		} else if(img.id === 'settings') {
			pageLink = '/tmp/settings.html';
		} else if(img.id === 'exit') {
			img.addEventListener('click', () => {
				ipcRenderer.send('app-quit');
			});
			return;
		} else {
			pageLink = '/tmp/' + img.id + '_' + img.id + '.html';
		}

		img.addEventListener('click', async() => {
			const appPath = await ipcRenderer.invoke('getAppPath');

			window.location.href = appPath + pageLink;
		});
	}
});

(async() => {
	window.AppDataManager = class AppDataManager {
		static async saveObject(moduleName, dataName, objectData) {
			return await ipcRenderer.invoke('AppDataManager-saveObject', moduleName, dataName, objectData);
		}
		static async loadObject(moduleName, dataName) {
			return await ipcRenderer.invoke('AppDataManager-loadObject', moduleName, dataName);
		}
		static async exists(moduleName, dataName) {
			return await ipcRenderer.invoke('AppDataManager-exists', moduleName, dataName);
		}
	};

	window.ConfigManager = class ConfigManager {
		static async get(moduleName, item) {
			return await ipcRenderer.invoke('ConfigManager-get', moduleName, item);
		}

		static async getMetadata(moduleName) {
			return await ipcRenderer.invoke('ConfigManager-getMetadata', moduleName);
		}

		static async set(moduleName, item, value) {
			return await ipcRenderer.invoke('ConfigManager-set', moduleName, item, value);
		}
	};

	window.getModulesList = async() => {
		return await ipcRenderer.invoke('getModulesList');
	};
})();