<script lang="ts">
	import ModeSwitcher from './ui/ModeSwitcher.svelte';
	import SvgViewer from './ui/SvgViewer.svelte';
	import Tailwindcss from './ui/Tailwindcss.svelte';
	import OverlayOutlet from './ui/OverlayOutlet.svelte';
	import MapDetails from './regions/MapDetails.svelte';
	import RegionList from './regions/RegionList.svelte';

	import { getFragments } from './common/helpers';
	import { downloadFile, copyToClipboard } from './common/general';

	let fragments = getFragments();

	let ratio = 1;

	let width: number;
	let height: number;
    let regions: MapRegion[] = [];
    let top_left: Point;
    let bottom_right: Point;
    let features: ViewerFeature[] = [];
    let moving: boolean = false;

	const options = { disable_pan: true };
	const actions: ViewAction[] = [
		{ id: '*', callback: (_, p) => {top_left = p; bottom_right = p; moving = true; console.log(p)}, action: 'mousedown' },
		{ id: '*', callback: (_, p) => {if (moving) bottom_right = p;}, action: 'mousemove' },
		{ id: '*', callback: (_, p) => {bottom_right = p;  moving = false;}, action: 'mouseup' }
	];

	function downloadMetadata() {
		downloadFile(JSON.stringify({
			url: fragments.src,
			width,
			height,
			regions: regions.map(i => { const r = {...i}; delete r.content; delete r.location; delete r.height; delete r.width; return r;})
		}, undefined, 4), 'map-metadata.json');
	}

	function copyMetadata() {
		copyToClipboard(JSON.stringify({
			url: fragments.src,
			width,
			height,
			regions: regions.map(i => { const r = {...i}; delete r.content; delete r.location; delete r.height; delete r.width; return r;})
		}, undefined, 4));
	}

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
	<div name="sidebar" class="h-full flex flex-col">
		<MapDetails bind:width={width} bind:height={height} {ratio} />
		<RegionList bind:regions={regions} {top_left} {bottom_right} />

		<button class="bg-white hover:bg-grey-100 rounded p-2 mx-4 my-2 text-black shadow active:shadow-xs" on:click={downloadMetadata}>Download Metadata</button>
		<button class="bg-white hover:bg-grey-100 rounded p-2 mx-4 my-2 mb-4 text-black shadow active:shadow-xs" on:click={copyMetadata}>Copy Metadata</button>
	</div>
	<div name="map" class="relative h-full flex-1">
		<SvgViewer bind:ratio={ratio} src={fragments.src} {actions} {options} features={regions} />
	</div>
</main>
<div hidden>
    {#each regions as region}
        <div
            bind:this={region.content}
            class="relative"
            style={ 'min-height:' + region.height * 10000 + '%; min-width:' + region.width * 10000 + '%;border: 2px solid ' + region.color + '; background-color: ' + region.color + '88;' }>
            <div class="absolute text-white text-shadow center whitespace-no-wrap">{ region.name }</div>
        </div>
    {/each}
</div>
<OverlayOutlet />
