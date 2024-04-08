<script lang="ts">
	import { onMount } from 'svelte';
	import type { LoginAttempt } from '../../types/loginAttempts';

	let loginAttempts: LoginAttempt[] = [];

	onMount(async () => {
		const response = await fetch('/api/login-attempts');
		loginAttempts = await response.json();
	});
</script>

<div class="flex justify-center">
	<div class="w-full md:w-11/12 lg:w-5/6 xl:w-3/4 p-6 bg-white shadow-md rounded-lg">
		<h2 class="text-2xl font-bold mb-4">Login Attempts</h2>
		<table class="w-full">
			<thead>
				<tr>
					<th class="py-2">ID</th>
					<th class="py-2">Username</th>
				</tr>
			</thead>
			<tbody>
				{#each loginAttempts as attempt}
					<tr>
						<td class="py-2 text-center">{attempt.id}</td>
						<td class="py-2 text-center">{attempt.username}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
