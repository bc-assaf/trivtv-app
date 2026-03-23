<script lang="ts">
	let { data } = $props();
	let pairingCode = $derived(data.paringCode);
	let status = $state('offline');

	// onMount(() => {
	// 	const chanelId = `pr-${data.pairingRequestId}`;
	// 	const channel = data.supabase
	// 		.channel(chanelId)
	// 		.on('broadcast', { event: 'paired' }, async (payload) => {
	// 			const dId = payload.payload.displayId;
	// 			console.log('Paired. displayId:', dId);
	// 			await startSession(dId, data.pairingRequestId);
	// 		})
	// 		.subscribe((status) => {
	// 			console.log('Subscribed to', chanelId, status);
	// 		});

	// 	// 2. The Cleanup function
	// 	return async () => {
	// 		console.log('Cleaning up channel...');
	// 		data.supabase.removeChannel(channel);
	// 	};
	// });

	// const startSession = async (displayId: string, pairingRequestId: string) => {
	// 	if (!displayId || !pairingRequestId) return;

	// 	console.log('in start session', displayId);
	// 	const res = await fetch(`/api/displays/${displayId}/session`, {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify({
	// 			pairingRequestId: pairingRequestId
	// 		})
	// 	});
	// 	const data = await res.json();

	// 	console.debug('session', data.sessionId);
	// };
</script>

<div class="container mx-auto">
	<h1 class="h1">TV</h1>
	<p>
		Pairing Code: <code>{pairingCode}</code>
	</p>
	<p>
		Status: <code>{status}</code>
	</p>
</div>
