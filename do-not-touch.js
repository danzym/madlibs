/**
 * DO NOT TOUCH ANY OF THE CODE BELOW HERE.
 *
 * Or you will be very sad.
 */
async function getRawStory() {
	const response = await fetch('story.txt');
	if (!response.ok) {
		const message = `An error has occurred: ${response.status}`;
		throw new Error(message);
	}
	const story = await response.text();
	return story;
}
