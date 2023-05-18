export default class ConfigManager {
	static async init() {
		if(await AppDataManager.exists('lumen_desktop', 'modules_config')) {
			ConfigManager.configurations = await AppDataManager.loadObject('lumen_desktop', 'modules_config');
		} else {
			ConfigManager.configurations = {};
		}
	}

	static buildMissingConfigItems(moduleName) {
		if(!ConfigManager.configurations[moduleName]) {
			ConfigManager.configurations[moduleName] = {};
		}

		for(const key in modulesMetaData[moduleName].config) {
			if(!ConfigManager.configurations[moduleName][key]) {
				switch(modulesMetaData[moduleName].config[key]) {
					case 'object[]':
					case 'string[]':
						ConfigManager.configurations[moduleName][key] = [];
						break;
					case 'object':
						ConfigManager.configurations[moduleName][key] = {};
						break;
					default:
						ConfigManager.configurations[moduleName][key] = null;
				}
			}
		}
	}

	static get(moduleName, item) {
		return ConfigManager.configurations[moduleName][item];
	}

	static async set(moduleName, item, value) {
		ConfigManager.configurations[moduleName][item] = value;

		// TODO: check type

		await AppDataManager.saveObject('lumen_desktop', 'modules_config', ConfigManager.configurations);
	}

	static getMetadata(moduleName) {
		return modulesMetaData[moduleName].config;
	}
}