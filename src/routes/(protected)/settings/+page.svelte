<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Navbar from '$lib/components/Navbar.svelte';
	import { writable } from 'svelte/store';

	let selectedColor = writable('black');
	export let savePreference = false;

	let userPreference: string | null = null;

	const colorOptions = [
		{ name: 'Black', value: 'black' },
		{ name: 'Green', value: 'green' },
		{ name: 'Blue', value: 'blue' }
	];

	onMount(() => {
		// Retrieve the user's color preference from the database
		userPreference = localStorage.getItem('colorPreference');
		if (userPreference) {
			selectedColor.set(userPreference);
		}
	});

	function saveColorPreference() {
		if (savePreference) {
			// Save the selected color to the database
			localStorage.setItem('colorPreference', $selectedColor);
		} else {
			// Remove the color preference from the database
			localStorage.removeItem('colorPreference');
		}
	}
</script>

<Navbar user={$page.data.user} />
<div class="container mx-auto mt-8 px-4">
	<h1 class="text-3xl font-bold mb-6">Settings</h1>
	<div class="bg-white rounded-lg shadow-md p-6">
		<h2 class="text-2xl font-bold mb-4">Accessibility</h2>
		<div class="mb-6">
			<h3 class="text-lg font-bold mb-2">Select Text Color</h3>
			<div class="flex flex-wrap space-x-4 mb-4">
				{#each colorOptions as color}
					<button
						class="w-16 h-16 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2"
						style="background-color: {color.value};"
						on:click={() => selectedColor.set(color.value)}
					>
						{#if $selectedColor === color.value}
							<span class="text-white text-lg font-bold">✓</span>
						{/if}
					</button>
				{/each}
			</div>
			<label for="savePreference" class="flex items-center mb-4">
				<input type="checkbox" id="savePreference" bind:checked={savePreference} class="mr-2" />
				Save preference
			</label>
			<button
				class="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
				on:click={saveColorPreference}
			>
				Save
			</button>
		</div>
	</div>
</div>
