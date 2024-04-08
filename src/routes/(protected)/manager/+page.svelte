<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Navbar from '$lib/components/Navbar.svelte';
	import { PrismaClient, type LoginAttempt, LoginStatus } from '@prisma/client';
	import { invalidateAll } from '$app/navigation';

	export let data;

	let loginAttempts = data.loginAttempts;
	let filteredAttempts = [...loginAttempts];
	let statusFilter = 'all';
	let startDate = '';
	let endDate = '';
	let currentPage = 1;
	let pageSize = 10;
	let totalPages = 1;

	onMount(() => {
		totalPages = Math.ceil(filteredAttempts.length / pageSize);
	});

	function getRowClass(status: LoginStatus) {
		switch (status) {
			case LoginStatus.SUCCESS:
				return 'border-l-4 border-green-500';
			case LoginStatus.FAILED:
				return 'border-l-4 border-red-500';
			case LoginStatus.LOGOUT:
				return 'border-l-4 border-blue-500';
			default:
				return '';
		}
	}

	function filterAttempts() {
		filteredAttempts = loginAttempts.filter((attempt) => {
			const attemptDate = new Date(attempt.timestamp);
			const start = startDate ? new Date(startDate) : null;
			const end = endDate ? new Date(endDate) : null;

			if (statusFilter !== 'all' && attempt.status !== statusFilter) {
				return false;
			}

			if (start && attemptDate < start) {
				return false;
			}

			if (end && attemptDate > end) {
				return false;
			}

			return true;
		});

		currentPage = 1;
		totalPages = Math.ceil(filteredAttempts.length / pageSize);
	}

	async function handleUnblockUser(userId: number) {
		const response = await fetch('/login-logs', {
			method: 'POST',
			body: JSON.stringify({ userId }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.ok) {
			await invalidateAll();
		}
	}

	$: paginatedResults = filteredAttempts.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize
	);
</script>

<Navbar user={$page.data.user} />
<div class="container mx-auto mt-8 px-4">
	<div class="overflow-x-auto">
		<div class="flex justify-between items-center mb-4">
			<h2 class="text-2xl font-bold">Login Logs</h2>
			<div class="flex space-x-4">
				<select
					bind:value={statusFilter}
					on:change={filterAttempts}
					class="border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
				>
					<option value="all">All</option>
					<option value={LoginStatus.SUCCESS}>Success</option>
					<option value={LoginStatus.FAILED}>Failed</option>
					<option value={LoginStatus.LOGOUT}>Logout</option>
				</select>
				<input
					type="date"
					bind:value={startDate}
					on:change={filterAttempts}
					class="border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
				/>
				<input
					type="date"
					bind:value={endDate}
					on:change={filterAttempts}
					class="border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
				/>
			</div>
		</div>
		<div class="box p-6 bg-white rounded-lg shadow-md overflow-x-auto">
			<table class="w-full table-auto border-collapse">
				<thead>
					<tr class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
						<th class="py-3 px-6 text-left">ID</th>
						<th class="py-3 px-6 text-left">Username</th>
						<th class="py-3 px-6 text-left">Timestamp</th>
						<th class="py-3 px-6 text-left">Status</th>
					</tr>
				</thead>
				<tbody class="text-gray-600 text-sm font-light">
					{#each paginatedResults as attempt}
						<tr class="border-b hover:bg-gray-50 {getRowClass(attempt.status)}">
							<td class="py-3 px-6 text-left whitespace-nowrap">
								{attempt.id}
							</td>
							<td class="py-3 px-6 text-left">{attempt.user.username}</td>
							<td class="py-3 px-6 text-left">{attempt.timestamp}</td>
							<td class="py-3 px-6 text-left capitalize">{attempt.status}</td>
							<td class="py-3 px-6 text-left">
								{#if $page.data.user.role === 'MANAGER' && attempt.user.disabled}
									<button
										class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
										on:click={() => handleUnblockUser(attempt.user.id)}
									>
										Unblock
									</button>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
			<div class="mt-4 flex justify-center">
				<button
					class="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
					disabled={currentPage === 1}
					on:click={() => currentPage--}
				>
					Previous
				</button>

				{#if totalPages <= 3}
					{#each Array(totalPages) as _, i}
						<button
							class="mx-1 px-4 py-1 rounded text-[#5D6A83] text-center"
							class:bg-[#EFF7FF]={currentPage === i + 1}
							class:text-[#194BfB]={currentPage === i + 1}
							class:hover:bg-[#EFF7FF]={currentPage !== i + 1}
							class:text-[#0D6EFD]={currentPage !== i + 1}
							on:click={() => (currentPage = i + 1)}
						>
							{i + 1}
						</button>
					{/each}
				{:else}
					{#if currentPage > 1}
						<button
							class="mx-1 px-4 py-1 rounded text-[#5D6A83] text-center"
							class:bg-[#EFF7FF]={currentPage === currentPage - 1}
							class:text-[#194BfB]={currentPage === currentPage - 1}
							class:hover:bg-[#EFF7FF]={currentPage !== currentPage - 1}
							class:text-[#0D6EFD]={currentPage !== currentPage - 1}
							on:click={() => (currentPage = currentPage - 1)}
						>
							{currentPage - 1}
						</button>
					{/if}

					<button
						class="mx-1 px-4 py-1 rounded text-[#5D6A83] text-center"
						class:bg-[#EFF7FF]={currentPage === currentPage}
						class:text-[#194BfB]={currentPage === currentPage}
						class:hover:bg-[#EFF7FF]={currentPage !== currentPage}
						class:text-[#0D6EFD]={currentPage !== currentPage}
						on:click={() => (currentPage = currentPage)}
					>
						{currentPage}
					</button>

					{#if currentPage < totalPages}
						<button
							class="mx-1 px-4 py-1 rounded text-[#5D6A83] text-center"
							class:bg-[#EFF7FF]={currentPage === currentPage + 1}
							class:text-[#194BfB]={currentPage === currentPage + 1}
							class:hover:bg-[#EFF7FF]={currentPage !== currentPage + 1}
							class:text-[#0D6EFD]={currentPage !== currentPage + 1}
							on:click={() => (currentPage = currentPage + 1)}
						>
							{currentPage + 1}
						</button>
					{/if}
				{/if}

				<button
					class="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
					disabled={currentPage === totalPages}
					on:click={() => currentPage++}
				>
					Next
				</button>
			</div>
		</div>
	</div>
</div>
