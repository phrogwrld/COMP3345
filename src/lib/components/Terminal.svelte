<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import type { TaxData, Taxpayer } from '../../types/taxpayer';

	export let taxData: TaxData | undefined;

	let command = '';
	let output: string[] = [];
	let commandHistory: string[] = [];
	let historyIndex = 0;
	let terminalContentRef: HTMLDivElement;

	afterUpdate(() => {
		scrollToBottom();
	});

	function handleSubmit() {
		if (command.trim() !== '') {
			output = [...output, `$ ${command.trim()}`];
			commandHistory = [command.trim(), ...commandHistory];
			historyIndex = 0;
			processCommand(command.trim());
			command = '';
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleSubmit();
		} else if (event.key === 'ArrowUp') {
			if (historyIndex < commandHistory.length) {
				command = commandHistory[historyIndex];
				historyIndex++;
			}
		} else if (event.key === 'ArrowDown') {
			if (historyIndex > 0) {
				historyIndex--;
				command = commandHistory[historyIndex] || '';
			}
		}
	}

	function processCommand(command: string) {
		const [action, attribute, limit] = command.split(' ');
		const validActions = ['list', 'total'];
		const validListAttributes = ['company', 'country', 'city'];
		const validTotalAttributes = [...validListAttributes, 'tax'];

		if (!validActions.includes(action)) {
			output = [...output, '<p class="text-red-500">Invalid command.</p>'];
			return;
		}

		const isValidAttribute =
			action === 'list'
				? validListAttributes.includes(attribute)
				: validTotalAttributes.includes(attribute);

		if (!isValidAttribute) {
			output = [...output, `<p class="text-red-500">Invalid attribute for ${action} query.</p>`];
			return;
		}

		const commandOutput =
			action === 'list'
				? fetchListData(attribute, parseInt(limit, 10)).map(formatTaxpayer)
				: [`Total ${attribute}: ${fetchTotalData(attribute)}`];
		output = [...output, `${commandOutput.join('<br>')}`];
	}

	function formatTaxpayer(taxpayer: Taxpayer): string {
		const formattedTax = taxpayer.tax.toLocaleString('en-US', {
			style: 'currency',
			currency: 'USD'
		});

		return `${taxpayer.company}, ${taxpayer.id}<br>
    ${taxpayer.street}, ${taxpayer.city}, ${taxpayer.country}<br>
    ${formattedTax}<br>`;
	}

	function fetchListData(attribute: string, limit: number) {
		const sortedData = taxData!.taxpayers.sort((a: any, b: any) =>
			a[attribute as keyof Taxpayer].localeCompare(b[attribute as keyof Taxpayer])
		);
		return sortedData.slice(0, limit);
	}

	function fetchTotalData(attribute: string) {
		if (attribute === 'company') {
			const uniqueCompanies = new Set(taxData!.taxpayers.map((taxpayer) => taxpayer.company));
			return uniqueCompanies.size;
		} else if (attribute === 'country') {
			const uniqueCountries = new Set(taxData!.taxpayers.map((taxpayer) => taxpayer.country));
			return uniqueCountries.size;
		} else if (attribute === 'city') {
			const uniqueCities = new Set(taxData!.taxpayers.map((taxpayer) => taxpayer.city));
			return uniqueCities.size;
		} else if (attribute === 'tax') {
			return taxData!.taxpayers.reduce((total, taxpayer) => total + taxpayer.tax, 0);
		}
		return 0;
	}

	function scrollToBottom() {
		terminalContentRef.scrollTop = terminalContentRef.scrollHeight;
	}
</script>

<h2 class="text-xl font-bold mb-4">Custom Query</h2>
{#if taxData}
	<div class="w-full h-full">
		<div class="terminal-container relative flex flex-col">
			<div
				class="top-bar rounded-t-lg absolute top-0 left-0 right-0 px-5 pt-4 pb-2 bg-gray-800 flex"
			>
				<div class="h-3 w-3 bg-red-500 rounded-full"></div>
				<div class="ml-2 h-3 w-3 bg-orange-300 rounded-full"></div>
				<div class="ml-2 h-3 w-3 bg-green-500 rounded-full"></div>
			</div>
			<div
				class="terminal-content px-5 pt-12 pb-6 shadow-lg text-gray-100 text-sm font-mono subpixel-antialiased bg-gray-800 rounded-lg overflow-y-scroll flex-grow h-96"
				bind:this={terminalContentRef}
			>
				<div class="mt-4 flex flex-col h-full">
					{#each output as line}
						<p class="mb-2">
							{@html line}
						</p>
					{/each}

					<div class="flex py-4">
						<span class="text-green-400">computer:~$</span>
						<input
							type="text"
							class="flex-1 bg-transparent pl-2 outline-none"
							bind:value={command}
							on:keydown={handleKeyDown}
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
{:else}
	<p class="text-gray-500">Please upload an XML file to view the tax data.</p>
{/if}

<style>
	.terminal-container {
		max-height: 400px;
	}

	.terminal-content {
		scrollbar-width: none; /* Firefox */
		-ms-overflow-style: none; /* Internet Explorer and Edge */
	}

	.terminal-content::-webkit-scrollbar {
		display: none; /* Chrome, Safari, and Opera */
	}
</style>
