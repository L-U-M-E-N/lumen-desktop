module.exports = function viewBuild() {
	const original = Date.now();

	if (!fs.existsSync(tmpDir)){
		fs.mkdirSync(tmpDir);
	}

	let index_content = fs.readFileSync('views/index_header.html');
	let style_content = fs.readFileSync('css/style.css');

	for(const folder of fs.readdirSync('./modules/')) {
		index_content += fs.readFileSync('./modules/' + folder + '/views/index.html');

		try {
			style_content += '\n' + fs.readFileSync('./modules/' + folder + '/css/style.css');
		} catch(e) {
			// Do nothing
		}
	}

	index_content += fs.readFileSync('views/index_footer.html');

	fs.writeFileSync(tmpDir + '/index.html', index_content);
	fs.writeFileSync(tmpDir + '/style.css', style_content);

	console.log('Build finished - ' + (Date.now() - original) + 'ms');
};
