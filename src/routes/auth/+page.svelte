<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';

	let { form } = $props();

	const urlMode = page.url.searchParams.get('mode');
	const initialMode = urlMode === 'login' ? 'login' : 'signup';

	let mode = $state<'signup' | 'login' | null>(initialMode);

	$effect(() => {
		const urlMode = page.url.searchParams.get('mode');
		mode = urlMode === 'login' ? 'login' : 'signup';
	});
</script>

<AppBar>
	<AppBar.Lead>
		<strong class="text-xl"><a href="/">TrivTV</a></strong>
	</AppBar.Lead>
</AppBar>
{#if mode === 'signup'}
	<div class="m-20 mx-auto max-w-md space-y-4 card preset-outlined-primary-500 p-4">
		<h3 class="h3">Sign Up</h3>
		<form class="w-full space-y-4" method="post" action="?/signup">
			<label class="label">
				<span class="label-text">Email</span>
				<input class="input" name="email" type="email" />
			</label>
			<label class="label">
				<span class="label-text">Password</span>
				<input class="input" name="password" type="password" />
			</label>
			<label class="label">
				<span class="label-text">Confirm Password</span>
				<input class="input" name="confirm-password" type="password" />
			</label>
			<label class="label">
				<span class="label-text">Display Name</span>
				<input class="input" name="display-name" type="text" />
			</label>
			<label class="flex items-center space-x-2">
				<input class="checkbox" type="checkbox" name="agree-to-terms" />
				<p>I agree to the terms of service and privacy policy</p>
			</label>

			<button
				type="submit"
				class="mt-4 btn w-full preset-filled-primary-500"
				formaction="?/register">Register</button
			>
			<a class="text-sm text-primary-500 hover:text-primary-900" href="?mode=login"
				>Already have an account</a
			>
		</form>
	</div>
{/if}

{#if mode === 'login'}
	<div class="m-20 mx-auto max-w-md space-y-4 card preset-outlined-primary-500 p-4">
		<h3 class="h3">Login</h3>
		<form class="w-full space-y-4" method="POST" action="?/login" use:enhance>
			<label class="label">
				<span class="label-text">Email</span>
				<input class="input" id="email" name="email" type="email" autocomplete="email" />
			</label>
			<label class="label">
				<span class="label-text">Password</span>
				<input
					class="input"
					id="password"
					name="password"
					type="password"
					autocomplete="current-password"
				/>
			</label>
			<a class="text-sm text-primary-500 hover:text-primary-900" href="?mode=login"
				>Forgot your password?</a
			>

			<button type="submit" class="mt-4 btn w-full preset-filled-primary-500">Login</button>
			{#if form?.message}
				<p class="text-error-500">
					{form.message}
				</p>
			{/if}
			<div class="flex flex-col items-start gap-y-2">
				<a class="text-sm text-primary-500 hover:text-primary-900" href="?mode=signup"
					>Create an account</a
				>
			</div>
		</form>
	</div>
{/if}
