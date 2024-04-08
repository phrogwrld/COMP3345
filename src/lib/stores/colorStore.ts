import { writable } from 'svelte/store';

export const colorMode = writable('black');

export function setColorPreference(color: string, remember: boolean) {
	colorMode.set(color);
	if (remember) {
		localStorage.setItem('textColor', color);
		localStorage.setItem('rememberColor', 'true');
	} else {
		localStorage.removeItem('textColor');
		localStorage.removeItem('rememberColor');
	}
}
