<script lang="ts">
	import { onMount } from 'svelte';
	import { XMLParser } from 'fast-xml-parser';
	import type { TaxData, Taxpayer } from '../types/taxpayer';
	import TaxTable from '$lib/components/TaxTable.svelte';
	import Terminal from '$lib/components/Terminal.svelte';
	import '../app.css';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import LoginAttempts from '$lib/components/LoginAttempts.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import SelectColor from '$lib/components/SelectColor.svelte';
	let showDropdown = false;

	let showModal = false;

	let taxData: TaxData | undefined;
	let selectedFile: File | undefined;
	let searchResults: Taxpayer[] = [];
	let currentPage = 1;
	let pageSize = 10;
	export let showTerminal: boolean;

	onMount(() => {
		const storedData = localStorage.getItem('taxData');
		if (storedData) {
			taxData = JSON.parse(storedData);
			searchResults = taxData!.taxpayers;
		} else {
			taxData = { taxpayers: [] };
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
</script>

<nav class="bg-blue-500 py-4">
	<div class="container mx-auto flex justify-between items-center">
		<h1 class="text-2xl font-bold text-white">Walamoo Tax System</h1>
		{#if $page.data.user}
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
						{$page.data.user.name}

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

<div class="container mx-auto mt-8 px-4 sm:px-6 lg:px-8">
	<div class="flex flex-col md:flex-row gap-8">
		<LoginAttempts />

		<button on:click={() => (showModal = true)}>show modal</button>
		<SelectColor bind:showModal />
		<!-- <Modal bind:showModal>
			<h2 class="text-2xl font-bold mb-4">Welcome to the Walamoo Tax System!</h2>
			<p class="text-center mb-6">You have successfully logged in.</p>
			<button
				class="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
			>
				Continue
			</button>
		</Modal> -->
		<!-- <div class="col-span-1">
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
		</div>
		<div class="col-span-3">
			{#if showTerminal}
				<div class="box p-6">
					<Terminal bind:taxData />
				</div>
			{:else}
				<TaxTable bind:taxData bind:searchResults bind:currentPage bind:pageSize />
			{/if}
		</div> -->
	</div>
</div>
