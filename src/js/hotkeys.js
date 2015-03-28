export default class Hotkeys {
	constructor() {
		window.addEventListener('keydown', this);
	}

	handleEvent(e) {
		console.log('key event', e);
		var key = e.key.toLowerCase();
		var metaDown = e.metaKey;

		if (key === 'r' && metaDown) {
			console.log('reloading');
			location.reload();
		}
	}
}
