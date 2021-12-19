export default class ConfigManager {
	static init() {
		if(AppDataManager.exists('lumen_desktop', 'modules_config')) {
			ConfigManager.configurations = AppDataManager.loadObject('lumen_desktop', 'modules_config');
		} else {
			ConfigManager.configurations = {};
		}

		console.log(modulesMetaData);

		for(const moduleName in modulesMetaData) {
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
						default:
							ConfigManager.configurations[moduleName][key] = null;
					}
				}
			}
		}

		console.log(ConfigManager.configurations);
	}

	static get(moduleName, item) {
		return ConfigManager.configurations[moduleName][item];
	}

	static set(moduleName, item, value) {
		ConfigManager.configurations[moduleName][item] = value;

		// TODO: check type

		AppDataManager.saveObject('lumen_desktop', 'modules_config', ConfigManager.configurations);
	}
}