async function onLoad() {
	const sectionHTML = document.getElementById('settings-list');

	// H1
	const topSettingsTitle = document.createElement('h1');
	topSettingsTitle.innerText = 'Settings';
	sectionHTML.appendChild(topSettingsTitle);

	const modulesList = await getModulesList();

	for(const moduleName of modulesList) {
		const moduleNameHTML = document.createElement('h2');
		moduleNameHTML.innerText = moduleName;
		sectionHTML.appendChild(moduleNameHTML);

		const config = await ConfigManager.getMetadata(moduleName);
		for(const configElementName in config) {
			sectionHTML.appendChild(createInputLabel(configElementName));

			if(config[configElementName] === 'string') {
				sectionHTML.appendChild(
					createTextInput(
						`${moduleName}-${configElementName}`,
						configElementName,
						await ConfigManager.get(moduleName, configElementName)
					)
				);
			} else {
				sectionHTML.appendChild(
					createTextareaInput(
						`${moduleName}-${configElementName}`,
						configElementName,
						JSON.stringify(
							await ConfigManager.get(moduleName, configElementName),
							null,
							4
						)
					)
				);
			}
		}
	}


	const button = document.createElement('input');
	button.setAttribute('type', 'button');
	button.addEventListener('click', async() => {
		for(const moduleName of modulesList) {
			const config = await ConfigManager.getMetadata(moduleName);
			for(const configElementName in config) {
				const value = document.getElementById(`${moduleName}-${configElementName}`).value;

				ConfigManager.set(moduleName, configElementName, value);

				if(config[configElementName] === 'string') {
					ConfigManager.set(moduleName, configElementName, value);
				} else {
					ConfigManager.set(moduleName, configElementName, JSON.parse(value));
					// TODO: show if error on parse
				}
			}
		}
	});
	button.value = 'Valider';

	sectionHTML.appendChild(button);
}

window.addEventListener('load', onLoad);