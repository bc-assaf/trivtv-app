<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	let { data, children } = $props();

	let supabase = $derived(data.supabase);
	let session = $derived(data.session);

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((_event, _session) => {
			console.log('Auth state changed', _event);
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});
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
