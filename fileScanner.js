let fs = require('fs');
let path = require('path');

module.exports = function fileScanner(startPath,filter,callback) {
	let regex = /(RECYCLE)/gi;
	let regex2 = /(System\ Volume\ Information)/gi;

	if(startPath.match(regex) !== null ||
		startPath.match(regex2) !== null) { return; }

	if (!fs.existsSync(startPath)){
		console.log("Dir not existing ", startPath);
		return;
	}
	//console.log("Scanning ", startPath);

	let files=fs.readdirSync(startPath);
	for(let i=0;i<files.length;i++){
		let filename=path.join(startPath,files[i]);

		if(filename.match(regex) !== null ||
			filename.match(regex2) !== null) { continue; }

		let stat = fs.lstatSync(filename);
		if(stat.isDirectory()){
			fileScanner(filename,filter,callback); //recurse
		} else if(filename.match(filter)) {
			callback(filename);
		}
	}
};