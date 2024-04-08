<script lang="ts">
	import { onMount } from 'svelte';
	import Modal from './Modal.svelte';

	export let showModal = false;
	export let selectedColor = 'black';
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
			selectedColor = userPreference;
		}
	});

	function saveColorPreference() {
		if (savePreference) {
			// Save the selected color to the database
			localStorage.setItem('colorPreference', selectedColor);
		} else {
			// Remove the color preference from the database
			localStorage.removeItem('colorPreference');
		}
		showModal = false;
	}

	function closeModal() {
		showModal = false;
	}
</script>

<Modal bind:showModal {closeModal}>
	<div class="p-6">
		<h2 class="text-2xl font-bold mb-4">Select Text Color</h2>
		<div class="flex space-x-4 mb-4">
			{#each colorOptions as color}
				<button
					class="w-16 h-16 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2"
					style="background-color: {color.value};"
					on:click={() => (selectedColor = color.value)}
				>
					{#if selectedColor === color.value}
						<span class="text-white text-lg font-bold">✓</span>
					{/if}
				</button>
			{/each}
		</div>
		<label for="savePreference" class="flex items-center mb-4">
			<input type="checkbox" id="savePreference" bind:checked={savePreference} class="mr-2" />
			Save preference
		</label>
		<div class="flex">
			<button
				class="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
				on:click={saveColorPreference}
			>
				Save and Close
			</button>
		</div>
	</div>
</Modal>
