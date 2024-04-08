<script lang="ts">
	import type { TaxData } from '../../types/taxpayer';
	export let handleFileUpload: (event: Event) => void;
	export let listByCompanyName: () => void;
	export let listByTotalTaxesPaid: () => void;
	export let listByCountry: () => void;
	export let openTerminal: () => void;
	export let clearFilters: () => void;
	export let taxData: TaxData | undefined;
	export let showTerminal: boolean;
</script>

<div class="box p-6">
	<h2 class="text-xl font-bold mb-4">Actions</h2>
	<div class="mb-4">
		<label for="fileUpload" class="block mb-2 font-bold">Select Data File:</label>
		<input
			type="file"
			id="fileUpload"
			on:change={handleFileUpload}
			class="w-full border border-gray-300 rounded p-2"
			accept=".xml"
		/>
	</div>
	<button
		class="block w-full mb-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
		on:click={() => {
			showTerminal = false;
			if (taxData) {
				listByCompanyName();
			}
		}}
	>
		List by Company Name
	</button>
	<button
		class="block w-full mb-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
		on:click={() => {
			showTerminal = false;
			if (taxData) {
				listByTotalTaxesPaid();
			}
		}}
	>
		List by Total Taxes Paid
	</button>
	<button
		class="block w-full mb-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
		on:click={() => {
			showTerminal = false;
			if (taxData) {
				listByCountry();
			}
		}}
	>
		List by Country
	</button>
	<button
		class="block w-full mb-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
		on:click={openTerminal}
	>
		Custom Query
	</button>
	<button
		class="block w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
		on:click={clearFilters}
	>
		Clear Filters
	</button>
</div>
