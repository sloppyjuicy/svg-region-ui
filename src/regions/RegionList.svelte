<script lang="ts">
    import Icon from '../ui/Icon.svelte';

    export let regions: MapRegion[] = [];
    export let top_left: Point = { x: .5, y: .5 };
    export let bottom_right: Point = { x: .5, y: .5 };

    let active_region = 0;

    $: {
        if (!regions || regions.length < 1) {
            regions = [{ name: 'Region 1', color: '#e66465', top: .5, left: .5, bottom: .5, right: .5 }]
        }
        regions[active_region].left = Math.floor(top_left.x * 1000) / 1000;
        regions[active_region].top = Math.floor(top_left.y * 1000) / 1000;
        regions[active_region].right = Math.floor(bottom_right.x * 1000) / 1000;
        regions[active_region].bottom = Math.floor(bottom_right.y * 1000) / 1000;
        regions[active_region].height = Math.abs(regions[active_region].top - regions[active_region].bottom);
        regions[active_region].width = Math.abs(regions[active_region].left - regions[active_region].right);
        regions[active_region].location = {
            x: (regions[active_region].left + regions[active_region].right) / 2,
            y: (regions[active_region].top + regions[active_region].bottom) / 2
        };
        regions = regions;
        console.log('R:', regions);
    }

    function newRegion() {
        regions = regions.concat([{
            name: `Region ${regions.length + 1}`,
            color: '#e66465',
            top: .5,
            left: .5,
            bottom: .5,
            right: .5,
            height: 0,
            width: 0,
            content: document.createElement('div')
        }]);
        regions = regions;
        setActive(regions.length - 1);
    }

    function setActive(i: number) {
        top_left = { x: regions[i].left, y: regions[i].top };
        bottom_right = { x: regions[i].right, y: regions[i].bottom };
        active_region = i;
    }

</script>
<style>
    [name="color"] {
        height: 1em;
        min-width: 1em;
        width: 1em;
    }

    [name="region-name"] {
        min-width: 4em;
    }

    li {
        border-bottom: 1px solid #f0f0f0;
    }

    li:last-child {
        border: none;
    }

    [name="badge"] {
        background-color: #4caf50;
    }
</style>

<ul name="list" class="rounded list-none m-4 bg-white shadow text-black overflow-auto flex-1">
    <li on:click={newRegion}>
        <button class=" rounded p-2 flex items-center w-full hover:bg-gray-100">
            <Icon klass="material-icons" content="add"/>
            New region
        </button>
    </li>
    {#each regions as region, i }
        <li class="p-2 flex items-center flex-wrap hover:bg-gray-100 cursor-pointer" on:click={e => setActive(i)}>
            <input type="color" name="color" class="rounded" bind:value={region.color} />
            <input type="text" name="region-name" class="px-3 mx-2 py-2 flex-1 text-base bg-transparent" bind:value={region.name} placeholder="Region Name" />
            <div class="text-xs flex items-center w-full text-gray-500 justify-end">
                {#if i === active_region}
                    <div name="badge" class="px-2 py-1 rounded text-white">Active</div>
                {/if}
                <div class="w-0 flex-1"></div>
                <div><span>{'{'} x: {region.left}, y: {region.top} {'}'}</span>,&nbsp;<span>{'{'} x: {region.right}, y: {region.bottom} {'}'}</span></div>
            </div>
        </li>
    {/each}
</ul>
