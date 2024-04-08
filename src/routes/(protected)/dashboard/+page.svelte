<script lang="ts">
	import { onMount } from 'svelte';
	import { XMLParser } from 'fast-xml-parser';
	import type { TaxData, Taxpayer } from '../../../types/taxpayer';
	import TaxTable from '$lib/components/TaxTable.svelte';
	import Terminal from '$lib/components/Terminal.svelte';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import Navbar from '$lib/components/Navbar.svelte';
	import Actions from '$lib/components/Actions.svelte';
	import SelectColor from '$lib/components/SelectColor.svelte';
	import Modal from '$lib/components/Modal.svelte';

	let showDropdown = false;
	let taxData: TaxData | undefined;
	let selectedFile: File | undefined;
	let searchResults: Taxpayer[] = [];
	let currentPage = 1;
	let pageSize = 10;
	export let showTerminal: boolean;
	let showModal = false;
	let showCitiesModal = false;

	let totalRecords = 400;
	let totalTaxPaid = 100574954;
	let totalCountries = 3;
	let totalCities = 9;

	let citiesPerCountry: { [country: string]: string[] } = {
		USA: ['New York', 'Los Angeles', 'Chicago'],
		Canada: ['Toronto', 'Vancouver', 'Montreal'],
		UK: ['London', 'Manchester', 'Birmingham']
	};

	onMount(() => {
		const storedData = localStorage.getItem('taxData');
		if (storedData) {
			taxData = JSON.parse(storedData);
			searchResults = taxData!.taxpayers;
		} else {
			taxData = { taxpayers: [] };
		}
		const modalShown = localStorage.getItem('modalShown');
		if (!modalShown) {
			showModal = true;
			localStorage.setItem('modalShown', 'true');
		}
	});

	function handleFileUpload(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (file) {
			selectedFile = file;
			const reader = new FileReader();
			reader.onload = () => {
				const xmlData = reader.result as string;
				taxData = parseTaxData(xmlData);
				localStorage.setItem('taxData', JSON.stringify(taxData));
				searchResults = taxData.taxpayers;
				currentPage = 1;
			};
			reader.readAsText(file);
		}
	}

	function parseTaxData(xmlData: string): TaxData {
		const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
		const json = parser.parse(xmlData);
		const taxpayers: Taxpayer[] = json.tifs.taxpayer.map((taxpayer: any) => ({
			id: taxpayer['@_id'],
			company: taxpayer.company,
			street: taxpayer.street,
			city: taxpayer.city,
			country: taxpayer.country,
			tax: parseFloat(taxpayer.tax)
		}));
		return { taxpayers };
	}

	function listByCompanyName() {
		if (taxData) {
			searchResults = [...taxData.taxpayers].sort((a, b) => a.company.localeCompare(b.company));
		}
	}

	function listByTotalTaxesPaid() {
		if (taxData) {
			searchResults = [...taxData.taxpayers].sort((a, b) => b.tax - a.tax);
		}
	}

	function listByCountry() {
		if (taxData) {
			searchResults = [...taxData.taxpayers].sort((a, b) => a.country.localeCompare(b.country));
		}
	}

	function openTerminal() {
		showTerminal = true;
	}

	function clearFilters() {
		if (taxData) {
			searchResults = [...taxData.taxpayers];
			currentPage = 1;
		}
	}

	function closeModal() {
		showModal = false;
	}
</script>

<Navbar user={$page.data.user} />
<SelectColor bind:showModal />

<div class="container mx-auto mt-8 px-4">
	<div class="mb-8">
		<h2 class="text-2xl font-bold mb-4">Tax System Statistics</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div class="bg-white rounded-lg shadow p-6">
				<p class="text-lg font-bold">Total Records: {totalRecords}</p>
			</div>
			<div class="bg-white rounded-lg shadow p-6">
				<p class="text-lg font-bold">Total Tax Paid: ${totalTaxPaid.toFixed(2)}</p>
			</div>
			<div class="bg-white rounded-lg shadow p-6">
				<p class="text-lg font-bold">Total Countries: {totalCountries}</p>
			</div>
			<div class="bg-white rounded-lg shadow p-6">
				<p class="text-lg font-bold">Total Cities: {totalCities}</p>
			</div>
		</div>
		<div class="mt-4">
			<button
				class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				on:click={() => (showCitiesModal = true)}
			>
				View Cities per Country
			</button>
		</div>
	</div>

	<div class="flex flex-col md:flex-row gap-8">
		<div class="md:w-1/4">
			<Actions
				{handleFileUpload}
				{listByCompanyName}
				{listByTotalTaxesPaid}
				{listByCountry}
				{openTerminal}
				{clearFilters}
				bind:taxData
				bind:showTerminal
			/>
		</div>
		<div class="md:w-3/4">
			{#if showTerminal}
				<div class="box p-6">
					<Terminal bind:taxData />
				</div>
			{:else}
				<TaxTable bind:taxData bind:searchResults bind:currentPage bind:pageSize />
			{/if}
		</div>
	</div>
</div>

<Modal bind:showModal={showCitiesModal} {closeModal}>
	<div class="p-6">
		<h2 class="text-2xl font-bold mb-4">Cities per Country</h2>
		{#each Object.entries(citiesPerCountry) as [country, cities]}
			<div class="mb-4">
				<h3 class="text-lg font-bold">{country}</h3>
				<ul class="list-disc pl-6">
					{#each cities as city}
						<li>{city}</li>
					{/each}
				</ul>
			</div>
		{/each}

		<button
			class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
			on:click={() => (showCitiesModal = false)}
		>
			Close
		</button>
	</div>
</Modal>
