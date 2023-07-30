async function getAllModules() {
	const res = await fetch('https://raw.githubusercontent.com/L-U-M-E-N/lumen-repository/main/repositories.json');
	if(!res.ok) {
		return [];
	}

	return await res.json();
}

async function onLoad() {
	const sectionHTML = document.getElementById('modules-list');

	// H1
	const topModulesTitle = document.createElement('h1');
	topModulesTitle.innerText = 'Modules';
	sectionHTML.appendChild(topModulesTitle);

	// Get Data
	const localModulesList = (await AppDataManager.loadObject('lumen_desktop', 'modules_config')).modules;
	const totalModulesList = await getAllModules();

	// No data
	if(totalModulesList.length === 0) {
		const noModulesError = document.createElement('p');
		noModulesError.innerText = 'Error when fetching modules list from Github';

		sectionHTML.appendChild(noModulesError);
		return;
	}

	console.log(localModulesList);
	console.log(totalModulesList);

	for(const moduleName in totalModulesList) {
		const moduleData = totalModulesList[moduleName];
		const localModule = localModulesList.find(x => x.name === moduleName)

		const moduleDiv = document.createElement('div');
		moduleDiv.classList.add('modules-list-element');
		
		// Title
		const titleElt = document.createElement('h2');
		titleElt.innerText = moduleData.moduleJson.fullName;
		moduleDiv.appendChild(titleElt);

		// Installed version
		const installedVersion = (typeof localModule === 'undefined' ? 'None' : localModule.version);
		const installedVersionDOM = document.createElement('span');
		installedVersionDOM.innerText = 'Installed version: ' + installedVersion;
		moduleDiv.appendChild(installedVersionDOM);

		// Available versions
		const availableVersions = document.createElement('div');

		const availableVersionsSpan = document.createElement('span');
		availableVersionsSpan.innerText = 'Available versions: ';
		availableVersions.appendChild(availableVersionsSpan);

		const versions = {};
		for(const version of moduleData.versions) {
			if(version.prerelease) {
				continue;
			}

			versions[version.tag_name] = {
				value: `${version.tag_name} (${(new Date(version.published_at)).toLocaleDateString()})`,
				selected: version.tag_name === installedVersion
			};
		}

		const selectDOM = createSelect(`${moduleName}-available-versions`, versions);
		availableVersions.appendChild(selectDOM);
		// TODO: onchange

		const chosenTag = moduleData.versions[0].tag_name;
		if(chosenTag !== installedVersion) {
			const input = document.createElement('input');
			input.setAttribute('type', 'button');
			if(installedVersion === 'None') {
				input.value = 'Install';
			} else if(installedVersion < chosenTag) {
				input.value = 'Update';
			} else {
				input.value = 'Downgrade';
			}
			input.addEventListener('click', async() => {
				moduleData.moduleJson.download_url = moduleData.versions.find(x => x.tag_name === chosenTag).zipball_url;
				await ipcRenderer.invoke('app-install-module', moduleData.moduleJson, chosenTag);
			});

			availableVersions.appendChild(input);
		}

		moduleDiv.appendChild(availableVersions);

		// Desktop ?
		const desktopDOM = document.createElement('p');
		desktopDOM.innerText = ((moduleData.moduleJson.desktop.module || moduleData.moduleJson.desktop.window) ? '✅' : '❌') + ' Desktop module';
		moduleDiv.appendChild(desktopDOM);

		// Server ?
		const serverDOM = document.createElement('p');
		serverDOM.innerText = (moduleData.moduleJson.server ? '✅' : '❌') + ' Server module';
		moduleDiv.appendChild(serverDOM);

		// Append module div
		sectionHTML.appendChild(moduleDiv);
	}

	// Restart app
	const restartDiv = document.createElement('div');

		const restartButton = document.createElement('input');
		restartButton.setAttribute('type', 'button');
		restartButton.value = 'Restart App';
		restartButton.addEventListener('click', () => {
			ipcRenderer.send('app-restart');
		});
		restartDiv.appendChild(restartButton)

	sectionHTML.appendChild(restartDiv);
}

window.addEventListener('load', onLoad);