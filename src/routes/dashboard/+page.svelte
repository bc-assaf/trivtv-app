<script lang="ts">
	let { data } = $props();
</script>

<h1 class="h1">Welcome to TrivTV 👋</h1>

<p>
	{data.userRecord?.email}
</p>

<div>
	User Record:
	<pre>{JSON.stringify(data.userRecord, null, 2)}</pre>
</div>
