<script lang="ts">
	import { onMount } from 'svelte';
	import { colorMode, setColorPreference } from '$lib/stores/colorStore';
	import { browser } from '$app/environment';

	let textColor = 'black';
	let rememberColor = false;

	onMount(async () => {
		if (browser) {
			const storedColor = localStorage.getItem('textColor');
			if (storedColor) {
				textColor = storedColor;
				colorMode.set(textColor);
			}
			rememberColor = localStorage.getItem('rememberColor') === 'true';
		}
	});

	async function handleColorSelection() {
		setColorPreference(textColor, rememberColor);
		window.location.href = '/';
	}
</script>

<h1>Select Font Color</h1>

<form on:submit|preventDefault={handleColorSelection}>
	<select bind:value={textColor}>
		<option value="black">Black</option>
		<option value="blue">Blue</option>
		<option value="green">Green</option>
	</select>

	<label>
		<input type="checkbox" bind:checked={rememberColor} />
		Remember color preference
	</label>

	<button type="submit">Save</button>
</form>
