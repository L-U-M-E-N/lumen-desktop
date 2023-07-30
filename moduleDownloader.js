import { execSync } from 'child_process';
import https from 'https';
import { createWriteStream } from 'fs';
import { readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'path';

export default class ModuleDownloader {
	static download(file, url, resolve) {
		const options = {
			headers: { 'User-Agent': 'Lumen-server module downloader https://github.com/L-U-M-E-N/lumen-server' }
		};

		console.log(url);
		const request = https.get(url, options, (response) => {
			console.log('Status code: ', response.statusCode);
			if(response.statusCode === 302) {
				return ModuleDownloader.download(file, response.headers.location, resolve);
			}

			response.pipe(file);

			// after download completed close filestream
			file.on("finish", () => {
				file.close();
				console.log("Download Completed");
				resolve();
			});
		});
	}

	static async install(moduleData, chosenTag) {
		let directoryList = await readdir('./modules/');

		console.log(moduleData);

		if(!moduleData.desktop.module && !moduleData.desktop.window) {
			return;
		}

		// Module already exists
		const modulePath = path.join('./modules/', moduleData.name);
		const moduleConfigPath = path.join(modulePath, 'module.json');
		let moduleConfig = {};
		if(directoryList.includes(moduleData.name)) {
			moduleConfig = JSON.parse(await readFile(moduleConfigPath, 'utf-8'));

			if(moduleConfig.version === chosenTag) {
				return;
			}

			await rm(modulePath, { recursive: true, force: true });
		}

		// Download module
		const zipPath = path.join('./modules/', moduleData.name + '.zip');
		await (new Promise((resolve, reject) => { 
			const file = createWriteStream(zipPath);
			const downloadURL = moduleData.download_url.replace('%VERSION%', chosenTag);
			ModuleDownloader.download(file, downloadURL, resolve);
		}));

		// Extract module
		execSync(`unzip ${zipPath} -d ${modulePath}`);
		execSync(`mv ${modulePath.replace('\\', '/')}/*/*  ${modulePath}`);

		await rm(zipPath);

		// Set version
		moduleConfig = JSON.parse(await readFile(moduleConfigPath, 'utf-8'));
		moduleConfig.version = chosenTag;

		await writeFile(moduleConfigPath, JSON.stringify(moduleConfig, null, 2));

		// TODO: execute npm install if package.json exists and npm run config/build/electron-build if exists in package.json

		// TODO: set config
	}

	// TODO: uninstall
}