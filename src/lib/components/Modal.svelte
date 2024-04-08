<script lang="ts">
	export let showModal: boolean;
	export let closeModal: () => void;
	let dialog: HTMLDialogElement;

	$: if (dialog && showModal) dialog.showModal();

	function handleCloseModal() {
		dialog.close();
		closeModal();
	}
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
	bind:this={dialog}
	on:close={handleCloseModal}
	on:click|self={() => {
		dialog.close();
	}}
	class="fixed inset-0 z-10 flex items-center justify-center rounded-md shadow-2xl"
>
	{#if showModal}
		<div class="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto flex flex-col items-center">
			<slot />
			<!-- <button
				class="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
				on:click={() => {
					dialog.close();
				}}
			>
				Continue
			</button> -->
		</div>
	{/if}
</dialog>
