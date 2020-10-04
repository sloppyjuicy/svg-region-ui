
<script>
    export let klass = "";
    export let content = "";
    export let src = ""
</script>

<style>
    img,
    i {
        font-size: 1em;
        height: 1em;
        width: 1em;
        margin: 8px;
    }
</style>

{#if src}
    <img src alt="icon"/>
{:else}
    <i class={klass}>{content}</i>
{/if}
