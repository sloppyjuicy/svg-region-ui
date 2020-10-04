<script lang="ts">
    import { active_overlays, backdrop_element, closeOverlay } from "./overlays";
</script>

<style>
    .overlay-container {
        pointer-events: none;
    }

    .overlay-container > * {
        pointer-events: auto;
    }

    .backdrop {
        pointer-events: none;
        background-color: rgba(0, 0, 0, 0.35);
    }
</style>

<div class="overlay-container cover-viewport">
    {#each $active_overlays as item, i}
        {#if $backdrop_element === item.id}
            <div class="backdrop cover-viewport" />
        {/if}
        <div
            class="close cover-viewport"
            on:click={(e) => (item.backdrop_close !== false ? closeOverlay(item.id) : '')}>
            <div class="overlay-wrapper" on:click={(e) => e.stopPropagation()}>
                <svelte:component
                    this={item.content}
                    details={item}
                    data={item.data}
                    on:event={item.onEvent} />
            </div>
        </div>
    {/each}
</div>
