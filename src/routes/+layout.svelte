<script>
	/** @type {{children?: import('svelte').Snippet}} */
	let { children } = $props();
</script>

<svelte:head>
	<title>GitHub OAuth example in SvelteKit</title>
</svelte:head>

{#if children}
{@render children?.()}
{:else}
<p>fallback content</p>
{/if}
