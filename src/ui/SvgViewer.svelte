
<script lang="ts">
    import { createViewer, removeViewer, updateViewer, applyGlobalStyles, getViewer } from '@yuion/svg-viewer';
    import { onDestroy, onMount } from 'svelte';

    /** URL to the SVG file */
    export let src: string;
    /** List of labels to render on top of the SVG */
    export let labels: ViewerLabel[];
    /** List of labels to render on top of the SVG */
    export let actions: ViewAction[];
    /** List of DOM elements to render over parts of the SVG */
    export let features: ViewerFeature[];
    /** Custom CSS styles to apply to the SVG */
    export let styles: ViewerStyles;
    /** Element or Point to focus on within the SVG */
    export let focus: ViewerFocusFeature;
    /** Center point of the SVG. X and Y values between 0 and 1 */
    export let options: ViewerOptions;
    /** Center point of the SVG. X and Y values between 0 and 1 */
    export let center: Point = { x: .5, y: .5 };
    /** Zoom level of the SVG. Value between 1 and 10 */
    export let zoom: number = 1;
    /**  */
    export let ratio: number = 1;

    /** ID of the active SVG viewer */
    let viewer: string;
    /** Container element for the SVG viewer */
    let viewer_el: HTMLDivElement;

    applyGlobalStyles();

    $: if (src) { createView(); }
    $: if (viewer) {
        updateViewer(viewer, { labels, features, styles, zoom, center, focus, actions, options });
    }

    function createView() {
        if (!viewer_el) return;
        if (viewer) removeViewer(viewer);
        createViewer({ url: src, element: viewer_el, labels, features, styles, focus, actions, options }).then(id => {
            viewer = id;
            ratio = getViewer(viewer)?.ratio || 1;
        });
    }

    onMount(() => createView());

    onDestroy(() => removeViewer(viewer));

</script>
<style>
    #viewer {
        top: 1em;
        left: 1em;
        right: 1em;
        bottom: 1em;
    }
</style>
<div id="viewer" class="absolute" bind:this={viewer_el}></div>
