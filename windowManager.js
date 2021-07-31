const DEFAULT_WIDTH = 1366;
const DEFAULT_HEIGHT = 768;

global.window = {
	Music: false,
	Pictures: false,
};

global.createWindow = function(title, documentURL, width=DEFAULT_WIDTH, height=DEFAULT_HEIGHT, options={}) {

	if(window[title] === true) { return {}; }

	if(window[title] === false) {
		window[title] = true;
	}

	const externalURL = (documentURL.substr(0, 4) === 'http');

	const windowData = {
		width,
		height,
		frame: externalURL,
		autoHideMenuBar: externalURL,
		icon: __dirname + './img/icon.png',
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		},
		title,
	};

	if(options !== undefined) {
		for(const i in options) {
			windowData[i] = options[i];
		}
	}

	const win = new BrowserWindow(windowData);

	// et charge le index.html de l'application.
	if(externalURL) {
		win.loadURL(documentURL);
	} else {
		win.loadFile(documentURL);
	}

	return win;
};

global.createWindowFromModule = function(title, moduleName, documentURL, width=DEFAULT_WIDTH, height=DEFAULT_HEIGHT, options={}) {
	const tmpURL = documentURL.replaceAll('views/', 'tmp/' + moduleName + '_');

	return createWindow(title, tmpURL, width, height, options);
};

global.closeWindow = function(title) {
	window[title] = false;
};

global.exitPopup = function() {
	const options = {
		parent: mainWindow,
		modal: true,
		resizable: false,
	};

	createWindow('Confirmation de fermeture', 'views/exitPopup.html',300,150, options);
};