const remote = require('electron').remote;

window.addEventListener('load', () => {
	const closebtn = document.querySelector('#window-close-button');

	if(!closebtn) {
		return;
	}

	closebtn.addEventListener('click', () => {
		if(typeof currentWindow === 'undefined') {
			console.log('Unable to find current window - abort');
			return;
		}

		if(currentWindow !== 'index') {
			remote.getCurrentWindow().close();
		} else {
			remote.getGlobal('exitPopup')();
		}
	});

	document.addEventListener('keydown', (e) => {
		if (e.which === 116) { // F5
			window.location.reload();
		}

		if (e.which === 123) { // F12
			remote.getCurrentWindow().toggleDevTools();
		}
	});
});

const viewNames = {};

window.addEventListener('beforeunload', () => {
	remote.getGlobal('console').log('Closing ' + currentWindow);
	remote.getGlobal('closeWindow')(viewNames[currentWindow]);
});