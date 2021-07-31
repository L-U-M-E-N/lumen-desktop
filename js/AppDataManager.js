const fs = require('fs');
const path = require('path');

module.exports = (appPath) => {
	const dataDirectory = path.resolve(appPath, 'data');
	if (!fs.existsSync(dataDirectory)) {
		fs.mkdirSync(dataDirectory);
	}

	return (class AppDataManager {
		static saveObject(moduleName, dataName, objectData) {
			const directory = path.resolve(dataDirectory, moduleName);
			if (!fs.existsSync(directory)) {
				fs.mkdirSync(directory);
			}

			fs.writeFileSync(
				path.resolve(directory, dataName + '.json'),
				JSON.stringify(objectData)
			);
		}

		static loadObject(moduleName, dataName) {
			return JSON.parse(
				fs.readFileSync(
					path.resolve(dataDirectory, moduleName, dataName + '.json'),
					'UTF-8'
				)
			);
		}

		static exists(moduleName, dataName) {
			const directory = path.resolve(dataDirectory, moduleName);
			if (!fs.existsSync(directory)) {
				fs.mkdirSync(directory);
			}

			return fs.existsSync(path.resolve(directory, dataName + '.json'));
		}
	});
};