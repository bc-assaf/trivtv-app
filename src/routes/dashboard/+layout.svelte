<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton-svelte';

	let { data, children } = $props(); // Svelte 5 syntax
</script>

<AppBar>
	<AppBar.Toolbar class="grid-cols-[auto_1fr_auto]">
		<AppBar.Lead>
			<strong class="text-xl"><a href="/">TrivTV</a></strong>
		</AppBar.Lead>
		<AppBar.Headline>
			<p></p>
		</AppBar.Headline>
		<AppBar.Trail>
			<a class="btn hover:preset-tonal" href="/dashboard">Dashboard</a>
			<a class="btn hover:preset-tonal" href="/dashboard/tvs">TVs & Devices</a>
			<form method="POST" action="/logout">
				<button type="submit" class="btn preset-outlined-primary-500">Logout</button>
			</form>
		</AppBar.Trail>
	</AppBar.Toolbar>
</AppBar>
<div class="container mx-auto p-8">
	{@render children()}
</div>
