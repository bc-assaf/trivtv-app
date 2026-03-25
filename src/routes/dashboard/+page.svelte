<script lang="ts">
	let { data } = $props();
</script>

<h1 class="h1">Welcome to TrivTV 👋</h1>

<p>
	{data.userProfile?.email}
</p>

<div>
	User Record:
	<pre>{JSON.stringify(data.userProfile, null, 2)}</pre>
</div>
