import { execSync } from 'child_process';
import https from 'https';
import { createWriteStream } from 'fs';
import { readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'path';

import AdmZip from 'adm-zip';

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
		let directoryList = await readdir(global.modulesPath);

		// Module already exists
		const modulePath = path.join(global.modulesPath, moduleData.name);
		const moduleConfigPath = path.join(modulePath, 'module.json');
		let moduleConfig = {};
		if(directoryList.includes(moduleData.name)) {
			moduleConfig = JSON.parse(await readFile(moduleConfigPath, 'utf-8'));

			if(moduleConfig.version === chosenTag) {
				return;
			}

			await rm(modulePath, { recursive: true, force: true });
		}

		if(moduleData.desktop.module || moduleData.desktop.window) {
			// Download module
			const zipPath = path.join(global.modulesPath, moduleData.name + '.zip');
			await (new Promise((resolve, reject) => { 
				const file = createWriteStream(zipPath);
				ModuleDownloader.download(file, moduleData.download_url, resolve);
			}));

			// Extract module
			const zip = new AdmZip(zipPath);
			zip.extractAllTo(/* targetPath*/ modulePath, /*overwrite*/ true);
			execSync(`mv ${modulePath.replace('\\', '/')}/*/*  ${modulePath}`);

			await rm(zipPath);

			// Set version
			moduleConfig = JSON.parse(await readFile(moduleConfigPath, 'utf-8'));
			moduleConfig.version = chosenTag;
			await writeFile(moduleConfigPath, JSON.stringify(moduleConfig, null, 2));
		}

		// Set Config
		let modules = [];
		let lumenConfig = {};
		if(await AppDataManager.exists('lumen_desktop', 'modules_config')) {
			lumenConfig = await AppDataManager.loadObject('lumen_desktop', 'modules_config');
			modules = lumenConfig.modules || [];
		}

		let updated = false;
		for(const moduleObj of modules) {
			if(moduleObj.name !== moduleData.name) {
				continue;
			}

			updated = true;

			moduleObj.version = chosenTag;
			moduleObj.client_download_url = moduleData.download_url;
			moduleObj.server_download_url = moduleData.download_url;
			moduleObj.client = moduleData.desktop.module || moduleData.desktop.window;
			moduleObj.server = moduleData.server;
		}

		if(!updated) {
			modules.push({
				name: moduleData.name,
				version: chosenTag,
				client_download_url: moduleData.download_url,
				server_download_url: moduleData.download_url,
				client: moduleData.desktop.module || moduleData.desktop.window,
				server: moduleData.server,
			});
		}

		await AppDataManager.saveObject('lumen_desktop', 'modules_config', {
			...lumenConfig,
			modules
		});
	}

	static async uninstall(moduleName) {
		const directoryList = await readdir(global.modulesPath);

		// Module already exists
		const modulePath = path.join(global.modulesPath, moduleName);
		const moduleConfigPath = path.join(modulePath, 'module.json');

		if(directoryList.includes(moduleName)) {
			await rm(modulePath, { recursive: true, force: true });
		}

		// Set Config
		let modules = [];
		let lumenConfig = {};
		if(await AppDataManager.exists('lumen_desktop', 'modules_config')) {
			lumenConfig = await AppDataManager.loadObject('lumen_desktop', 'modules_config');
			modules = lumenConfig.modules || [];
		}

		await AppDataManager.saveObject('lumen_desktop', 'modules_config', {
			...lumenConfig,
			modules: modules.filter(x => x.name !== moduleName)
		});
	}
}