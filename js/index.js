let colCount = 0;
let colWidth = 0;
const margin = 18;
let windowWidth = 0;
let blocks = [];

function setupBlocks() {
	windowWidth = parseFloat(getComputedStyle(document.getElementsByClassName('main')[0], null).width.replace('px', ''));
	colWidth = parseFloat(getComputedStyle(document.getElementsByClassName('module')[0], null).width.replace('px', ''));
	colCount = Math.floor(windowWidth/(colWidth+margin));
	blocks = [];

	for(let i=0; i < colCount; i++) {
		blocks.push(margin);
	}

	positionBlocks();
}

function positionBlocks() {
	for(const elt of document.getElementsByClassName('module')) {
		const min = Math.min(...blocks);
		const index = blocks.indexOf(min);
		const leftPos = margin+(index*(colWidth+margin));

		elt.style.left = leftPos + 'px';
		elt.style.top = min + 'px';

		blocks[index] = min+elt.offsetHeight + margin;
	}
}

window.addEventListener('resize', setupBlocks);
window.addEventListener('load', () => {
	setupBlocks();
});