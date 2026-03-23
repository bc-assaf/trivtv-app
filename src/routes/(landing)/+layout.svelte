<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton-svelte';

	let { children, data } = $props();
</script>

<!-- App Bar -->
<AppBar>
	<AppBar.Toolbar class="grid-cols-[auto_1fr_auto]">
		<AppBar.Lead>
			<strong class="text-xl"><a href="/">TrivTV</a></strong>
		</AppBar.Lead>
		<AppBar.Headline>
			<p></p>
		</AppBar.Headline>
		<AppBar.Trail>
			<a class="btn hover:preset-tonal" href="/pricing">Pricing</a>
			<a class="btn hover:preset-tonal" href="/docs">Docs</a>
			<a class="btn hover:preset-tonal" href="/contact">Contact</a>
			<!-- {#if data.userRecord}
				<a href="/dashboard" class="btn preset-filled-primary-500">Dashboard</a>
			{:else}
				<a href="/auth/login" class="btn preset-filled-primary-500">Login</a>
			{/if} -->
			<a href="/dashboard" class="btn preset-filled-primary-500">Dashboard</a>
		</AppBar.Trail>
	</AppBar.Toolbar>
</AppBar>
<div class="container mx-auto p-8">
	{@render children()}
</div>
