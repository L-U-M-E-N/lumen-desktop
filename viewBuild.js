module.exports = function viewBuild() {
	const original = Date.now();

	if (!fs.existsSync(tmpDir)){
		fs.mkdirSync(tmpDir);
	}

	const header_content = fs.readFileSync('views/index_header.html');
	const footer_content = fs.readFileSync('views/index_footer.html');

	// @TODO

	const final_content = header_content + footer_content;

	fs.writeFileSync(tmpDir + '/index.html', final_content);

	console.log('"index.html" build finished - ' + (Date.now() - original) + 'ms');
};
