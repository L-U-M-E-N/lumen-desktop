function transformFile(fileContent, moduleName) {
	fileContent = fileContent.replaceAll('src="../js/', 'src="../modules/' + moduleName + '/js/');
	fileContent = fileContent.replaceAll('src="../img/', 'src="../modules/' + moduleName + '/img/');
	fileContent = fileContent.replaceAll('href="../css/', 'href="../modules/' + moduleName + '/css/');

	return fileContent;
}

module.exports = function viewBuild() {
	const original = Date.now();

	if (!fs.existsSync(tmpDir)){
		fs.mkdirSync(tmpDir);
	}

	let index_content = fs.readFileSync('views/index_header.html');
	let style_content = fs.readFileSync('css/style.css');

	for(const moduleName of fs.readdirSync('./modules/')) {
		const viewContent = fs.readFileSync('./modules/' + moduleName + '/views/index.html').toString();
		index_content += transformFile(viewContent, moduleName);

		try {
			style_content += '\n' + fs.readFileSync('./modules/' + moduleName + '/css/style.css');
		} catch(e) {
			// Do nothing
		}

		const viewDir = './modules/' + moduleName + '/views/';
		for(const viewName of fs.readdirSync(viewDir)) {
			if(viewName === 'index.html') {
				continue;
			}

			let viewContent = fs.readFileSync(viewDir + viewName).toString();
			viewContent = transformFile(viewContent, moduleName);
			viewContent = '<script type="text/javascript" src="../js/main.js"></script><link rel="stylesheet" type="text/css" href="./style.css">' + viewContent;
			fs.writeFileSync(
				tmpDir + '/' + moduleName + '_' + viewName,
				viewContent
			);
		}

		// Serverside
		try {
			if (fs.existsSync('./modules/' + moduleName + '/main.js')) {
				require('./modules/' + moduleName + '/main.js');
			}
		} catch(err) {
			console.error(err);
		}
	}

	index_content += fs.readFileSync('views/index_footer.html');

	fs.writeFileSync(tmpDir + '/index.html', index_content);
	fs.writeFileSync(tmpDir + '/style.css', style_content);

	console.log('Build finished - ' + (Date.now() - original) + 'ms');
};
