<script lang="ts">
	import { AppBar, Avatar, Menu, Portal } from '@skeletonlabs/skeleton-svelte';
	import { goto, invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	let { data, children } = $props();

	let session = $derived(data.session);
	let profile = $derived(data.userProfile);

	let initials = $derived.by(() => {
		if (!data.userProfile?.displayName) return '';

		const parts = data.userProfile.displayName.trim().split(/\s+/);
		if (parts.length === 0) return '';

		const first = parts[0][0];
		const last = parts.length > 1 ? parts[parts.length - 1][0] : '';

		return (first + last).toUpperCase();
	});

	async function handleLogout() {
		const response = await fetch('/logout', {
			method: 'POST',
			// SvelteKit actions usually expect an empty body or specific form data
			body: new FormData()
		});

		if (response.ok) {
			// This clears the client-side cache and redirects
			await goto('/auth/login', { invalidateAll: true });
		}
	}

	onMount(() => {
		const {
			data: { subscription }
		} = data.supabase.auth.onAuthStateChange((_event, _session) => {
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

			<Menu>
				<Menu.Trigger>
					<Avatar class="size-10  bg-primary-800 text-primary-contrast-800">
						<Avatar.Fallback>{initials}</Avatar.Fallback>
					</Avatar>
				</Menu.Trigger>
				<Portal>
					<Menu.Positioner>
						<Menu.Content>
							<Menu.ItemGroup>
								<Menu.ItemGroupLabel>Signed in As</Menu.ItemGroupLabel>
								<Menu.Item value="user">
									<Menu.ItemText
										><div>{profile?.displayName}</div>
										<div class="text-sm text-gray-500">{profile?.email}</div>
									</Menu.ItemText>
								</Menu.Item>
							</Menu.ItemGroup>

							<Menu.Separator />
							<Menu.Item
								value="logout"
								onclick={handleLogout}
								class="hover:bg-surface-hover cursor-pointer p-2"
							>
								<Menu.ItemText>Logout</Menu.ItemText>
							</Menu.Item>
						</Menu.Content>
					</Menu.Positioner>
				</Portal>
			</Menu>
		</AppBar.Trail>
	</AppBar.Toolbar>
</AppBar>
<div class="container mx-auto p-8">
	{@render children()}
</div>
