<script lang="ts">
	import { onMount } from 'svelte';
	import { colorMode } from '$lib/stores/colorStore';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import '../app.css';

	let textColor = 'black';

	onMount(() => {
		if (browser) {
			const storedColor = localStorage.getItem('colorPreference');
			if (storedColor) {
				colorMode.set(storedColor);
			}

			colorMode.subscribe((value) => {
				textColor = value;
			});
		}
	});

	$: if (
		browser &&
		$page.url.pathname !== '/select-color' &&
		!$page.url.pathname.startsWith('/login')
	) {
		const storedColor = localStorage.getItem('colorPreference');
		if (storedColor) {
			colorMode.set(storedColor);
		} else {
			colorMode.set('black');
		}
	}
</script>

<!-- <script>
	import '../app.css';
</script>

<div class="relative flex min-h-screen flex-col">
	<div class="w-full h-full">
		<div class="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
			<div class="hidden border-r md:block">
				<div class="flex h-full max-h-screen flex-col gap-2">
					<div class="flex-1">
						<nav class="grid items-start px-2 text-sm font-medium lg:px-4">
							<a
								class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
								href="#"
								><svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="lucide lucide-home h-4 w-4"
									><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline
										points="9 22 9 12 15 12 15 22"
									></polyline></svg
								>Dashboard</a
							>
						</nav>
					</div>
				</div>
			</div>
			<slot />
		</div>
	</div>
</div> -->
<main class="bg-[#F5F7FA] min-h-screen overflow-x-hidden" style="color: {textColor};">
	<slot />
</main>
