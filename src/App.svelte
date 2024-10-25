<svelte:options
        customElement={{
            tag: "svelte-life-game",
    }}
/>

<script lang="ts">
    import {createLifeGame} from './lib/state/';
    import LifeGameBoard from './lib/LifeGameBoard.svelte';
    import Oops from './lib/Oops.svelte';

    let result = createLifeGame(20, 20);

    let {lifeGame, err} = $derived.by(() => {
        return result.match(
            (lifeGame) => ({lifeGame, err: undefined}),
            (err) => ({lifeGame: undefined, err}),
        );
    });
</script>

<div class="container">
    {#if err}
        <Oops message={err.message}/>
    {:else if lifeGame}
        <LifeGameBoard {lifeGame}/>
    {/if}
</div>

<style>
    :host {
        font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
        line-height: 1.5;
        font-weight: 400;

        color-scheme: light dark;
        color: rgba(255, 255, 255, 0.87);
        background-color: #242424;

        font-synthesis: none;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    :host {
        margin: 0;
        display: flex;
        place-items: center;
        min-width: 320px;
        min-height: 100vh;
    }

    .container {
        max-width: 1280px;
        margin: 0 auto;
        padding: 2rem;
        text-align: center;
    }

    @media (prefers-color-scheme: light) {
        :root {
            color: #213547;
            background-color: #ffffff;
        }
    }
</style>
