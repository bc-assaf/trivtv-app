<script lang="ts">
	import { onMount } from 'svelte';

	let { data } = $props();
	let pairingCode = $derived(data.paringCode);

	onMount(() => {
		const chanelId = `pr-${data.pairingRequestId}`;
		const channel = data.supabase
			.channel(chanelId)
			.on('broadcast', { event: 'paired' }, (payload) => {
				console.log('paired', payload);
			})
			.subscribe((status) => {
				console.log('Subscribed to', chanelId, status);
			});

		// 2. The Cleanup function
		return () => {
			console.log('Cleaning up channel...');
			data.supabase.removeChannel(channel);
		};
	});
</script>

<div class="container mx-auto">
	<h1 class="h1">TV</h1>
	<p>
		Pairing Code: <code>{pairingCode}</code>
	</p>
</div>
