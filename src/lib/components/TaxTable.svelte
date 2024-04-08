<script lang="ts">
	import type { TaxData, Taxpayer } from '../../types/taxpayer';

	export let taxData: TaxData = { taxpayers: [] };
	export let searchResults: Taxpayer[] = [];
	export let currentPage = 1;
	export let pageSize = 10;

	function formatCurrency(amount: number): string {
		return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
	}

	$: paginatedResults = searchResults.slice((currentPage - 1) * pageSize, currentPage * pageSize);
	$: totalPages = Math.ceil(searchResults.length / pageSize);
</script>

<div class="box p-6 overflow-x-auto">
	<h2 class="text-xl font-bold mb-8">Search Results</h2>
	{#if taxData.taxpayers.length > 0}
		<table class="w-full table-auto mt-4 lg:whitespace-nowrap">
			<thead>
				<tr class="bg-[#fafafa] text-[#5D6A83] capitalize text-base font-medium leading-normal">
					<th class="py-3 px-6 text-left">Company</th>
					<th class="py-3 px-6 text-left">Street</th>
					<th class="py-3 px-6 text-left">City</th>
					<th class="py-3 px-6 text-left">Country</th>
					<th class="py-3 px-6 text-right">Tax Paid</th>
				</tr>
			</thead>
			<tbody class="text-sm">
				{#each paginatedResults as taxpayer}
					<tr class="border-b border-gray-200 hover:bg-gray-100">
						<td class="py-4 px-6">{taxpayer.company}</td>
						<td class="py-4 px-6">{taxpayer.street}</td>
						<td class="py-4 px-6">{taxpayer.city}</td>
						<td class="py-4 px-6">{taxpayer.country}</td>
						<td class="py-4 px-6 text-right">{formatCurrency(taxpayer.tax)}</td>
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
	{:else}
		<p class="text-gray-500">Please upload an XML file to view the tax data.</p>
	{/if}
</div>
