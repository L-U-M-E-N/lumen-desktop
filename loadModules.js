import fs from 'fs';
import path from 'path';

global.modulesMetaData = {};

function transformFile(fileContent, moduleName) {
	fileContent = fileContent.replaceAll('src="../js/', 'src="../modules/' + moduleName + '/js/');
	fileContent = fileContent.replaceAll('src="../img/', 'src="../modules/' + moduleName + '/img/');
	fileContent = fileContent.replaceAll('href="../css/', 'href="../modules/' + moduleName + '/css/');

	return fileContent;
}

export default async function loadModules() {
	const original = Date.now();

	if (!fs.existsSync(tmpDir)){
		fs.mkdirSync(tmpDir);
	}

	let sidebar_menu = '';
	let style_content = fs.readFileSync(path.resolve(cssPath, 'style.css'));

	const skel_header = fs.readFileSync(path.resolve(viewsPath, 'skel_header.html'));
	const skel_middle = fs.readFileSync(path.resolve(viewsPath, 'skel_middle.html'));
	const skel_footer = fs.readFileSync(path.resolve(viewsPath, 'skel_footer.html'));

	const outputViews = {
		'index.html': ''
	};

	for(const moduleName of fs.readdirSync(modulesPath)) {
		if(!fs.statSync(path.resolve(modulesPath, moduleName)).isDirectory()) {
			continue;
		}

		// Load config
		modulesMetaData[moduleName] = JSON.parse(fs.readFileSync(path.resolve(modulesPath, moduleName, 'module.json')));

		ConfigManager.buildMissingConfigItems(moduleName);

		// Client
		if(modulesMetaData[moduleName].desktop.module) {
			const viewContent = fs.readFileSync(path.resolve(modulesPath, moduleName, 'views', 'index.html')).toString();
			outputViews['index.html'] += transformFile(viewContent, moduleName);
		}

		if(modulesMetaData[moduleName].desktop.window) {
			sidebar_menu += '<img src="../modules/' + moduleName + '/icon.svg" id="' + moduleName + '" class="menu-active" />';
		}

		try {
			style_content += '\n\n' + fs.readFileSync(path.resolve(modulesPath, moduleName, 'css', 'style.css'));
		} catch(e) {
			// Do nothing
		}

		const viewDir = path.resolve(modulesPath, moduleName, 'views');
		for(const viewName of fs.readdirSync(viewDir)) {
			if(viewName === 'index.html') {
				continue;
			}

			outputViews[moduleName + '_' + viewName] = fs.readFileSync(path.resolve(viewDir, viewName)).toString();
			outputViews[moduleName + '_' + viewName] = transformFile(outputViews[moduleName + '_' + viewName], moduleName);
		}

		// Serverside
		try {
			if (fs.existsSync(path.resolve(modulesPath, moduleName, 'main.js'))) {
				console.log('Loading ./modules/' + moduleName + '/main.js');
				await import('./modules/' + moduleName + '/main.js');
			}
		} catch(err) {
			console.error(err);
		}
	}

	outputViews['index.html'] += '<script type="text/javascript" src="../js/index.js"></script>';

	for(const viewName in outputViews) {
		let file_content = skel_header;
		file_content += sidebar_menu;
		file_content += skel_middle;
		file_content += outputViews[viewName];
		file_content += skel_footer;

		fs.writeFileSync(tmpDir + '/' + viewName, file_content);
	}

	fs.writeFileSync(tmpDir + '/style.css', style_content);

	console.log('Build finished - ' + (Date.now() - original) + 'ms');
}
