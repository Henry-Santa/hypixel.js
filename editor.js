const inputEl = document.querySelector('[data-el="input"]');
		const highlightEl = document.querySelector('[data-el="highlight"]');
		const outputEl = document.querySelector('[data-el="output"]');

const converter = new showdown.Converter({
	metadata: true,
	parseImgDimensions: true,
	strikethrough: true,
	tables: true,
	ghCodeBlocks: true,
	smoothLivePreview: true,
	simpleLineBreaks: true,
	emoji: true,
});

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
			"markdown",
			inputEl.value
		).value;
		highlightEl.innerHTML = highlighted;
	});
};

const updateReadonly = () => {
	window.requestAnimationFrame(() => {
		const htmlContent = converter.makeHtml(inputEl.value);
		outputEl.innerHTML = htmlContent;
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
	updateReadonly();
})