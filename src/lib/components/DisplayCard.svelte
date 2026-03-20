<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	let { display, action } = $props();

	let pairingCode = $state<string | undefined>();
	let error = $state<string | undefined>();

	let isValid = $derived(pairingCode?.length === 6);

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
			}
			console.debug('display activated');
			invalidateAll();
		} catch (e) {
			console.error('Error while pairing display:', e);
		}
	};

	let inputRef = $state<HTMLInputElement>();
	$effect(() => {
		inputRef?.focus();
	});
</script>

<div class="min-w-75 basis-[calc(50%-0.55rem)] flex-col gap-2 card preset-outlined-primary-500 p-4">
	<header>
		<span class="h5">{display.displayName}</span>
	</header>
	<form class="flex w-full flex-col space-y-4" method="POST" novalidate onsubmit={pairDisplay}>
		<label>
			<span class="label-text">Pairing Code</span>
			<input
				bind:this={inputRef}
				class="input"
				type="text"
				name="pairingCode"
				minlength="6"
				maxlength="6"
				required
				bind:value={pairingCode}
			/>
		</label>
		<button type="button" disabled={!isValid} class="mt-4 btn preset-filled-primary-500"
			>Pair</button
		>
	</form>
	{error}
</div>
