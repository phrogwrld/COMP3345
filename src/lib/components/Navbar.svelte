<script lang="ts">
	import { enhance } from '$app/forms';
	export let user: any;
	let showDropdown = false;
</script>

<nav class="bg-blue-500 py-4">
	<div class="container mx-auto flex justify-between items-center px-4">
		<a href="/dashboard">
			<h1 class="text-2xl font-bold text-white">Walamoo Tax System</h1>
		</a>
		{#if user}
			<div class="relative">
				<button
					class="flex items-center text-white"
					on:click={() => (showDropdown = !showDropdown)}
				>
					<span class="flex items-center">
						<svg
							class="w-12 h-12 mr-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
						{user.name}

						<svg
							class="w-4 h-4 ml-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							></path>
						</svg>
					</span>
				</button>
				{#if showDropdown}
					<div class="absolute right-0 mt-2 py-2 w-48 bg-white rounded shadow-lg z-10">
						<a href="/settings" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">Settings</a>
						<form action="/logout" method="POST" use:enhance>
							<button class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
								>Logout</button
							>
						</form>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</nav>
