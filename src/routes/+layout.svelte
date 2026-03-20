<script lang="ts">
	import './layout.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	let { data, children } = $props();

	// Use $derived to keep these synced with the data prop
	let supabase = $derived(data.supabase);
	let session = $derived(data.session);

	onMount(() => {
		const path = page.url.pathname;
		if (path.startsWith('/tv') || path.startsWith('/player')) {
			return;
		}

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

{@render children()}
