<script lang="ts">
    import { onDestroy } from 'svelte';
    import type { FloatingMenuDetails } from '../common/types';
    import { closeOverlay } from './overlays';

    export let data: { target: HTMLElement; menu_details: FloatingMenuDetails };
    let listener = document.addEventListener('scroll', updatePosition);
    let box: ClientRect;

    function updatePosition() {
        if (data?.target) {
            box = data.target.getBoundingClientRect();
        }
    }

    $: if (data?.target) {
        updatePosition();
    }

    onDestroy(() => document.removeEventListener('scroll', updatePosition));
</script>

<style>
    .floating-menu {
        list-style: none;
    }

    button {
        text-align: left;
    }

    .name {
        flex: 1;
        width: 10em;
        min-width: 50%;
    }

    .details {
        font-size: .8em;
        opacity: .65;
    }
</style>

{#if box && data.menu_details && data.menu_details.items}
    <ul class="floating-menu absolute flex flex-col shadow-base bg-white p-0 m-0" style="top: {box.bottom}px; left {Math.max(2, box.left)}px;">
        {#each data.menu_details.items as item}
            <li>
                <button class="flex items-center bg-transparent border-0 hover:bg-gray-100 py-2 m-0 min-w-full transition-colors rounded-none"
                    on:click={(e) => {
                        item.action ? item.action() : '';
                        closeOverlay('floating-menu');
                    }}>
                    <div class="name">{item.name}</div>
                    <div class="details">{item.details || ''}</div>
                </button>
            </li>
        {/each}
    </ul>
{/if}
