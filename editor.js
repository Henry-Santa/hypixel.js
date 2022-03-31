import * as HyJs from './hypixel.js';
const inputEl = document.querySelector('[data-el="input"]');
const highlightEl = document.querySelector('[data-el="highlight"]');
const outputEl = document.querySelector('[data-el="output"]');
const button = document.getElementById('button');

const resizeTextarea = (textArea) => {
	if (!textArea) {
		return;
	}


	window.requestAnimationFrame(() => {
		textArea.style.height = 0;
		if (textArea.scrollHeight > 0) {
			textArea.style.height = `${textArea.scrollHeight + 2}px`;
		}
	});
};

const highlight = () => {
	window.requestAnimationFrame(() => {
		const highlighted = hljs.highlight(
			"javascript",
			inputEl.value
		).value;
		highlightEl.innerHTML = highlighted;
	});
};

const updateReadonly = () => {
	window.requestAnimationFrame(() => {
		console.log("update readonly");
	});
};

const init = () => {
	inputEl.addEventListener("input", () => {
		resizeTextarea(inputEl);
		highlight();
		updateReadonly();
	});
	inputEl.setAttribute('data-initialized', true);
}

document.addEventListener("DOMContentLoaded", () => {
	init();
	resizeTextarea(inputEl);
	highlight();
})
var currScript = null;
async function onClick(){
	const code = inputEl.value;
	if (currScript) {
		currScript = null;
	}
	eval("async function theirCode(){\n" + code + "\n}theirCode();");
	
};
window.onClick = onClick;