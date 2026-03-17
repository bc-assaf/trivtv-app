<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	let { data } = $props();

	const { form, errors, message, constraints, enhance } = $derived(superForm(data.form));
</script>

<!-- <SuperDebug data={{ $form, $errors }} /> -->

<div class="mx-auto max-w-md space-y-5 card preset-outlined-surface-200-800 bg-surface-50-950 p-5">
	<header>
		<span class="h3">Login</span>
	</header>
	<form class="w-full space-y-4" method="POST" use:enhance novalidate>
		<label class="label">
			<span class="label-text">Email</span>
			<input
				class="input"
				name="email"
				type="email"
				bind:value={$form.email}
				autocomplete="email"
				class:input-error={$errors.email}
				{...$constraints.email}
			/>
			{#if $errors.email}
				<span class="text-sm text-error-500">{$errors.email[0]}</span>
			{/if}
		</label>

		<label class="label">
			<span class="label-text">Password</span>
			<input
				class="input"
				name="password"
				type="password"
				bind:value={$form.password}
				aria-invalid={$errors.email ? 'true' : undefined}
				autocomplete="current-password"
				class:input-error={$errors.password}
				{...$constraints.password}
			/>
			{#if $errors.password}
				<span class="text-sm text-error-500">{$errors.password[0]}</span>
			{/if}
		</label>

		<a class="text-sm text-primary-500 hover:text-primary-800" href="/auth/forgot-password"
			>Forgot your password? (todo)</a
		>

		<button type="submit" class="mt-4 btn w-full preset-filled-primary-500">Login</button>

		{#if $errors._errors}
			<span class="text-sm text-error-500">{$errors._errors[0]}</span>
		{/if}
		<div class="py-2">
			<a class="text-sm text-primary-500 hover:text-primary-800" href="/auth/signup"
				>Create an account</a
			>
		</div>
	</form>
</div>
