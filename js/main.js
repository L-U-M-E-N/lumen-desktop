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
	window.AppDataManager = require('../js/AppDataManager')(await ipcRenderer.invoke('getAppPath'));
})();