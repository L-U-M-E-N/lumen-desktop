function createInputLabel(name) {
	const elementDOM = document.createElement('label');
	elementDOM.setAttribute('for', name);
	elementDOM.innerText = name[0].toUpperCase() + name.slice(1, name.length);

	return elementDOM;
}

function createTextInput(id, name, value) {
	const elementDOM = document.createElement('input');
	elementDOM.id = id;
	elementDOM.setAttribute('name', name);
	elementDOM.setAttribute('placeholder', name);
	elementDOM.setAttribute('type', 'text');
	elementDOM.value = value;

	return elementDOM;
}

function createTextareaInput(id, name, value) {
	const elementDOM = document.createElement('textarea');
	elementDOM.id = id;
	elementDOM.setAttribute('name', name);
	elementDOM.setAttribute('placeholder', name);
	elementDOM.value = value;

	setTimeout(() => {
		elementDOM.style.height = '5px';
		elementDOM.style.height = (elementDOM.scrollHeight)+'px';
	}, 250);

	return elementDOM;
}

function createSelect(id, options) {
	const elementDOM = document.createElement('select');
	elementDOM.id = id;

	for(const optionName in options) {
		const optionDOM = document.createElement('option');
		optionDOM.value = optionName;
		optionDOM.innerText = options[optionName].value;
		optionDOM.selected = options[optionName].selected;

		elementDOM.appendChild(optionDOM);
	}

	return elementDOM;
}