<script lang="ts">
    export let src: string = "";

    let form_str: string = "";
</script>

<style>
    form {
        width: 32em;
    }

    input {
        border: 1px solid #f0f0f0;
        width: 30em;
    }

    h3 {
        background-color: #b71c1c;
    }
</style>

<div class="absolute inset-0 bg-gray-100 flex justify-center">
    <form
        class="bg-white shadow rounded m-4 flex flex-col space-y-2 flex-none items-center h-40 overflow-hidden"
        on:submit={(e) => {
            src = form_str;
            e.preventDefault();
        }}>
        <h3 class="text-white w-full mb-2 py-2 px-4 text-lg">Input SVG URL to continue</h3>
        <input class="rounded p-2 mx-2" bind:value={form_str} placeholder="SVG URL e.g. https://my.domain/path/to/file.svg" />
        <button class="bg-gray-200 m-2 hover:bg-gray-400 rounded h-10 w-32" disabled={!form_str}>View Map</button>
    </form>
</div>
