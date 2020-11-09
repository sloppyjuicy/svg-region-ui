<script lang="ts">
    import { Md5 } from "ts-md5";
    import { isChildFrame, retrieveData, sendMessage } from "./common/iframe";
    import { getFragments } from "./common/helpers";
    import { downloadFile, copyToClipboard } from "./common/general";
    import type { MapRegion } from "./common/types";
    import type { Point, ViewAction } from "@yuion/svg-viewer";

    import SvgViewer from "./ui/SvgViewer.svelte";
    import Tailwindcss from "./ui/Tailwindcss.svelte";
    import OverlayOutlet from "./ui/OverlayOutlet.svelte";
    import MapDetails from "./regions/MapDetails.svelte";
    import RegionList from "./regions/RegionList.svelte";
    import SvgForm from "./SvgForm.svelte";

    let fragments = getFragments();

    let ratio = 1;

    let width: number;
    let height: number;
    let regions: MapRegion[] = [];
    let top_left: Point;
    let bottom_right: Point;
    let moving: boolean = false;
    let zoom = 1;

    const options = { disable_pan: true };
    const actions: ViewAction[] = [
        {
            id: "*",
            callback: (_, p) => {
                top_left = p;
                bottom_right = p;
                moving = true;
            },
            action: "mousedown",
        },
        {
            id: "*",
            callback: (_, p) => {
                if (moving) bottom_right = p;
            },
            action: "mousemove",
        },
        {
            id: "*",
            callback: (_, p) => {
                bottom_right = p;
                moving = false;
            },
            action: "mouseup",
        },
    ];

    const formatted_data = () => ({
        url: fragments.src,
        width,
        height,
        areas: regions.map(formatRegion),
    });

    const formatRegion = (r, idx) => {
        const updated = {
            id: `${r.name.toLowerCase().split(' ').join('-')}`,
            type: "Feature",
            feature_type: "section",
            geometry: {
                type: "Polygon",
                coordinates: r.points,
            },
            properties: {
                name: r.name,
                capacity: r.capacity
            },
        };
        return updated;
    };

    function saveMetadata() {
        sendMessage({
            type: "backoffice",
            action: "metadata",
            name: "map_regions",
            content: formatted_data(),
        });
    }

    const downloadMetadata = () =>
        downloadFile(
            JSON.stringify(formatted_data(), undefined, 4),
            "map-metadata.json"
        );

    const copyMetadata = () =>
        copyToClipboard(JSON.stringify(formatted_data(), undefined, 4));

    retrieveData().then(
        (d) => {
            height = d.height || height;
            width = d.width || width;
            regions = d.areas;
            if (regions[0]) {
                top_left = {
                    x: regions[0].left,
                    y: regions[0].top,
                };
                bottom_right = {
                    x: regions[0].right,
                    y: regions[0].bottom,
                };
            }
        },
        (e) => console.error(e)
    );
</script>

<style>
    main {
        background-color: #f0f0f0;
    }

    [name="map"] {
        min-width: 50%;
    }
    [name="sidebar"] {
        width: 20em;
    }
</style>

<Tailwindcss />
<main class="absolute inset-0 flex">
    {#if fragments.src}
        <div name="sidebar" class="h-full flex flex-col">
            <MapDetails bind:width bind:height {ratio} />
            <RegionList bind:regions {top_left} {bottom_right} />
            {#if isChildFrame()}
                <button
                    class="bg-white hover:bg-grey-100 rounded p-2 mx-4 my-2 text-black shadow active:shadow-xs"
                    on:click={saveMetadata}>Save Metadata</button>
            {:else}
                <button
                    class="bg-white hover:bg-grey-100 rounded p-2 mx-4 my-2 text-black shadow active:shadow-xs"
                    on:click={downloadMetadata}>Download Metadata</button>
            {/if}
            <button
                class="bg-white hover:bg-grey-100 rounded p-2 mx-4 my-2 mb-4 text-black shadow active:shadow-xs"
                on:click={copyMetadata}>Copy Metadata</button>
        </div>
        <div name="map" class="relative h-full flex-1">
            <SvgViewer
                bind:ratio
                bind:zoom
                src={fragments.src}
                {actions}
                {options}
                features={regions} />
        </div>
    {:else}
        <SvgForm bind:src={fragments.src} />
    {/if}
</main>
<div hidden>
    {#each regions as region}
        <div
            bind:this={region.content}
            class="relative"
            style={'min-height:' + region.height * 1000 * zoom * ratio + '%; min-width:' + region.width * 1000 * zoom + '%;border: 2px solid ' + region.color + '; background-color: ' + region.color + '88;'}>
            <div
                class="absolute text-white text-shadow center whitespace-no-wrap">
                {region.name}
            </div>
        </div>
    {/each}
</div>
<OverlayOutlet />
