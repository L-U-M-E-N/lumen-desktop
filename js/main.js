const remote = require('electron').remote;
const { app } = require('electron');

window.addEventListener('load', () => {
	document.addEventListener('keydown', (e) => {
		if (e.which === 116) { // F5
			window.location.reload();
		}

		if (e.which === 123) { // F12
			remote.getCurrentWindow().toggleDevTools();
		}
	});
});

window.addEventListener('load', () => {
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

		img.addEventListener('click', () => {
			window.location.href = require('electron').remote.app.getAppPath() + pageLink;
		});
	}
});

window.AppDataManager = require('../js/AppDataManager')(remote.getGlobal('app'));