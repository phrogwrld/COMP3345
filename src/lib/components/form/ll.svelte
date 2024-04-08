<script lang="ts">
	function handleFileDrop(event: DragEvent) {
		event.preventDefault();
		const file = event.dataTransfer?.files[0];
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
</script>

<div class="mb-4">
	<label
		class="flex cursor-pointer appearance-none justify-center rounded-md border border-dashed border-gray-300 bg-white px-3 py-6 text-sm transition hover:border-gray-400 focus:border-solid focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-75"
		for="fileUpload"
		on:dragover|preventDefault
		on:drop|preventDefault={handleFileDrop}
	>
		<span class="flex items-center space-x-2">
			<svg class="h-6 w-6 stroke-gray-400" viewBox="0 0 256 256">
				<!-- SVG path omitted for brevity -->
			</svg> <span class="text-xs font-medium text-gray-600"> Drop XML file here to upload </span>
		</span>
		<input type="file" id="fileUpload" class="hidden" on:change={handleFileUpload} accept=".xml" />
	</label>
</div>
