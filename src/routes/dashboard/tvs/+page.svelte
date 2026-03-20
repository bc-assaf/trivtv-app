<script lang="ts">
	import DisplayCard from '$lib/components/DisplayCard.svelte';
	let { data } = $props();
	let displays = $derived(data.displays);
</script>

<h1 class="h3">TVs & Devices</h1>
<div class="flex flex-wrap gap-4 py-4">
	{#each displays as display (display.id)}
		<DisplayCard {display} action="?/pair" />
	{/each}
</div>
