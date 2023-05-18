import path from 'path';

import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';

export default async(appPath) => {
	async function existsAsync(target) {
		return await stat(target)
			.then(() => true)
			.catch(() => false);
	}

	async function makeDirectoryIfNotExists(dir) {
		if (!(await existsAsync(dir))) {
			await mkdir(dir);
		}
	}

	const dataDirectory = path.resolve(appPath, 'data');
	await makeDirectoryIfNotExists(dataDirectory);

	return (class AppDataManager {
		static async saveObject(moduleName, dataName, objectData) {
			const directory = path.resolve(dataDirectory, moduleName);
			await makeDirectoryIfNotExists(directory);

			await writeFile(
				path.resolve(directory, dataName + '.json'),
				JSON.stringify(objectData, null, 4)
			);
		}

		static async loadObject(moduleName, dataName) {
			return JSON.parse(
				await readFile(
					path.resolve(dataDirectory, moduleName, dataName + '.json'),
					'UTF-8'
				)
			);
		}

		static async exists(moduleName, dataName) {
			const directory = path.resolve(dataDirectory, moduleName);
			await makeDirectoryIfNotExists(directory);

			return await existsAsync(path.resolve(directory, dataName + '.json'));
		}
	});
};