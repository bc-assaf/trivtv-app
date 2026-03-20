<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();
	let { form, errors, constraints, enhance } = $derived(superForm(data.form));
</script>

<!-- <SuperDebug data={{ $form, $errors }} /> -->

<div class="mx-auto max-w-md space-y-5 card preset-outlined-surface-200-800 bg-surface-50-950 p-5">
	<header>
		<span class="h3">Sign up</span>
	</header>
	<form class="w-full space-y-4" method="post" use:enhance novalidate>
		<label class="label">
			<span class="label-text">Email</span>
			<input
				class="input"
				name="email"
				type="email"
				bind:value={$form.email}
				{...$constraints.email}
				class:input-error={$errors.email}
			/>
			{#if $errors.email}
				<span class="text-sm text-error-500">{$errors.email[0]}</span>
			{/if}
		</label>

		<label class="label">
			<span class="label-text">Display Name</span>
			<input
				class="input"
				name="displayName"
				type="text"
				bind:value={$form.displayName}
				{...$constraints.displayName}
				class:input-error={$errors.displayName}
			/>
			{#if $errors.displayName}
				<span class="text-sm text-error-500">{$errors.displayName[0]}</span>
			{/if}
		</label>

		<label class="label">
			<span class="label-text">Password</span>
			<input
				class="input"
				name="password"
				type="password"
				bind:value={$form.password}
				{...$constraints.password}
				class:input-error={$errors.password}
			/>
			{#if $errors.password}
				<span class="text-sm text-error-500">{$errors.password[0]}</span>
			{/if}
		</label>

		<label class="label">
			<span class="label-text">Confirm Password</span>
			<input
				class="input"
				name="confirmPassword"
				type="password"
				bind:value={$form.confirmPassword}
				{...$constraints.confirmPassword}
				class:input-error={$errors.confirmPassword}
			/>
			{#if $errors.confirmPassword}
				<span class="text-sm text-error-500">{$errors.confirmPassword[0]}</span>
			{/if}
		</label>

		<label class="flex items-center space-x-2">
			<input
				class="checkbox"
				type="checkbox"
				name="agreeToTerms"
				bind:checked={$form.agreeToTerms}
				{...$constraints.agreeToTerms}
			/>
			<p>
				I agree to the <a href="/terms-of-service" class="link text-primary-500">terms of service</a
				>
				and
				<a href="/terms-of-service#privacy" class="link text-primary-500">privacy policy</a>
			</p>
		</label>
		{#if $errors.agreeToTerms}
			<div class="text-sm text-error-500">{$errors.agreeToTerms[0]}</div>
		{/if}

		<button type="submit" class="mt-4 btn w-full preset-filled-primary-500">Sign up</button>

		{#if $errors._errors}
			<span class="text-sm text-error-500">{$errors._errors[0]}</span>
		{/if}
		<div class="py-2">
			<a class="text-sm text-primary-500 hover:text-primary-800" href="/auth/login"
				>Already have an account</a
			>
		</div>
	</form>
</div>
