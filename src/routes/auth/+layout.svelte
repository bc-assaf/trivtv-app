<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton-svelte';

	let { children } = $props();
</script>

<AppBar>
	<AppBar.Lead>
		<strong class="text-xl"> <a href="/"> TrivTV </a></strong>
	</AppBar.Lead>
</AppBar>
<div class="container mx-auto p-8">
	{@render children()}
</div>
