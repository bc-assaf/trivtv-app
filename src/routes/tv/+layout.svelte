<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let { data, children } = $props();

	onMount(() => {
		const chanelId = `pr-${data.pairingRequestId}`;
		const channel = data.supabase
			.channel(chanelId)
			.on('broadcast', { event: 'paired' }, async (payload) => {
				const dId = payload.payload.displayId;
				console.log('Paired. displayId:', dId);
				await startSession(dId, data.pairingRequestId);
			})
			.subscribe((status) => {
				console.log('Subscribed to', chanelId, status);
			});

		// 2. The Cleanup function
		return async () => {
			console.log('Cleaning up channel...');
			data.supabase.removeChannel(channel);
		};
	});

	const startSession = async (displayId: string, pairingRequestId: string) => {
		if (!displayId || !pairingRequestId) return;

		console.log('in start session', displayId);
		const res = await fetch(`/api/public/displays/${displayId}/session`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pairingRequestId: pairingRequestId
			})
		});

		if (res.ok) {
			// const data = await res.json();
			console.debug('session created', data);
			goto(`/tv/game`);
		}
	};
</script>

{@render children()}
