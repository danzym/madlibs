function parseStory(rawStory) {
	const parsedStory = [];
	const regex = /(\w+\[[a-z]\])\s*|([\w.,;!?]+\s*)/gi;
	const matches = rawStory.match(regex);

	matches.forEach((match) => {
		const posMatch = match.match(/(\w+)\[([a-z])\]/i);
		if (posMatch) {
			const word = posMatch[1];
			const pos = posMatch[2];
			const posMap = { n: 'noun', v: 'verb', a: 'adjective' };
			parsedStory.push({ word, pos: posMap[pos] });
		} else {
			parsedStory.push({ word: match });
		}
	});

	return parsedStory;
}

function createMadLibs(parsedStory) {
	let editViewStory = '';
	let previewStory = '';
	const inputIds = [];

	parsedStory.forEach((element, index) => {
		const { word, pos } = element;
		const inputId = `input_${index}`;

		if (pos) {
			inputIds.push(inputId);
			const placeholder = ` ${pos}`; // create a placeholder string based on the part of speech
			const inputElement = `<input type="text" id="${inputId}" class="empty" maxlength="20" placeholder="${placeholder}">`; // add the placeholder attribute to the input element
			editViewStory += inputElement;
			previewStory += `<span id="preview_${index}" class="preview"></span>`;
		} else {
			editViewStory += word;
			previewStory += word;
		}
	});

	document.querySelector('.madLibsEdit').innerHTML = editViewStory;
	document.querySelector('.madLibsPreview').innerHTML = previewStory;

	inputIds.forEach((id) => {
		const inputIndex = id.split('_')[1];
		const inputElement = document.getElementById(id);
		const previewElement = document.getElementById(`preview_${inputIndex}`);

		if (previewElement) {
			// add check to make sure preview span exists
			inputElement.addEventListener('input', function (event) {
				const value = event.target.value;
				inputElement.className = value ? 'filled' : 'empty';

				previewElement.textContent = value;
			});

			inputElement.addEventListener('focus', function () {
				inputElement.classList.add('focused');
			});

			inputElement.addEventListener('blur', function () {
				inputElement.classList.remove('focused');
			});

			inputElement.addEventListener('keydown', function (event) {
				if (event.key === 'Enter') {
					event.preventDefault();
					const nextIndex = index + 1;
					if (nextIndex < inputIds.length) {
						document.getElementById(inputIds[nextIndex]).focus();
					}
				}
			});
		}
	});
}

getRawStory()
	.then(parseStory)
	.then(createMadLibs)
	.catch((error) => {
		console.error('Error processing story:', error);
	});
