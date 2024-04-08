<script lang="ts">
	import { enhance } from '$app/forms';

	// import { enhance, applyAction } from '$app/forms';
	import Input from '$lib/components/form/Input.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<div class="flex items-center justify-center min-h-screen">
	<div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
		<div class="flex items-center justify-center mb-6">
			<svg class="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
				/>
			</svg>
			<h1 class="text-2xl font-bold text-center ml-2">Login To The Walamo Tax System</h1>
		</div>
		<form use:enhance method="POST" action="?/login" class="space-y-6">
			<div>
				<label for="username" class="block text-sm font-medium text-gray-700">Username</label>
				<input
					type="text"
					name="username"
					id="username"
					class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
					required
				/>
			</div>
			<div>
				<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
				<input
					type="password"
					name="password"
					id="password"
					class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
					required
				/>
			</div>
			{#if form?.message}
				<p class="text-red-500 text-sm">{form.message}</p>
			{/if}
			<div>
				<button
					type="submit"
					class="w-full flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
				>
					Login
				</button>
			</div>
		</form>
	</div>
</div>
