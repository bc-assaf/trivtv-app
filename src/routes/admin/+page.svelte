<script lang="ts">
	let { data } = $props();
</script>

<h1>Hello, this is Admin home</h1>
<a href="/auth">Login</a>

{data.user.email}
{data.user.user_metadata.displayName}

<pre>{JSON.stringify(data.user, null, 2)}</pre>
