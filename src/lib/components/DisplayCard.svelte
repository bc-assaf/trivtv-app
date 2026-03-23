<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	let { display } = $props();

	let pairingCode = $state<string | undefined>();
	let error = $state<string | undefined>();

	let isValid = $derived(pairingCode?.length === 6);

	$effect(() => {
		if (pairingCode && pairingCode?.length < 6) error = undefined;
	});

	const pairDisplay = async (e: SubmitEvent) => {
		e.preventDefault();

		if (!isValid) return;

		try {
			const res = await fetch(`/api/displays/${display.id}/pair`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					pairingCode: pairingCode!
				})
			});
			const data = await res.json();

			if (res.status !== 200) {
				error = data.message;
				return;
			}
			console.debug('display activated', res);
			invalidateAll();
		} catch (e) {
			console.error('Error while pairing display:', e);
		}
	};
</script>

<div class="min-w-75 basis-[calc(50%-0.55rem)] flex-col gap-2 card preset-outlined-primary-500 p-4">
	<header>
		<span class="h5">{display.displayName}</span>
	</header>
	<form class="flex w-full flex-col space-y-4" method="POST" novalidate onsubmit={pairDisplay}>
		<label>
			<span class="label-text">Pairing Code</span>
			<input
				class="input"
				type="text"
				name="pairingCode"
				minlength="6"
				maxlength="6"
				required
				bind:value={pairingCode}
			/>
		</label>
		<button type="submit" disabled={!isValid} class="mt-4 btn preset-filled-primary-500"
			>Pair</button
		>
	</form>
	{error}
</div>
