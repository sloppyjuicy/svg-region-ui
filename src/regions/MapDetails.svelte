<script lang="ts">
    export let width: number = 100;
    export let height: number = 100;
    export let ratio: number = 1;

    $: {
        height = Math.floor(ratio * width * 1000) / 1000;
    }
</script>
<style>
    label {
        width: 8em;
    }
</style>

<div name="details" class="rounded list-none m-4 p-2 bg-white shadow text-black overflow auto">
    <h3 class="font-bold">Map Settings</h3>
    <div class="flex flex-col">
        <label class="text-sm font-normal" for="map-height">Height:</label>
        <input type="number" name="map-height" class="px-3 mx-2 py-2 flex-1 text-base bg-transparent" value={height} placeholder="Map Height" />
    </div>
    <div class="flex flex-col">
        <label class="text-sm font-normal" for="map-width">Width:</label>
        <input type="number" name="map-width" class="px-3 mx-2 py-2 flex-1 text-base bg-transparent" value={width} placeholder="Map Width" />
    </div>
</div>
