<svelte:options
        customElement={{
            tag: "svelte-life-game",
            props: {
                rowSize: { reflect: true, type: 'Number', attribute: 'row' },
                colSize: { reflect: true, type: 'Number', attribute: 'col' },
                cellSize: { reflect: true, type: 'String', attribute: 'cell-size' },
                gridColor: { reflect: true, type: 'String', attribute: 'grid-color' },
                aliveCellColor: { reflect: true, type: 'String', attribute: 'alive-cell-color' },
                deadCellColor: { reflect: true, type: 'String', attribute: 'dead-cell-color' },
            },
    }}
/>

<script lang="ts">
    import {createLifeGame} from './lib/state/';
    import LifeGameBoard from './lib/LifeGameBoard.svelte';
    import Oops from './lib/Oops.svelte';

    type Props = {
        rowSize?: number;
        colSize?: number;

        cellSize?: string;

        gridColor?: string;
        aliveCellColor?: string;
        deadCellColor?: string;
    };

    let {
        rowSize = 20,
        colSize = 20,
        cellSize = '30px',
        gridColor = '#333',
        aliveCellColor = 'red',
        deadCellColor = '#eee',
    }: Props = $props();

    let result = createLifeGame(rowSize, colSize);

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
        <LifeGameBoard {lifeGame}
                       {cellSize}
                       {gridColor}
                       {aliveCellColor}
                       {deadCellColor}
        />
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
