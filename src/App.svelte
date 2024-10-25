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

<main>
    {#if err}
        <Oops message={err.message}/>
    {:else if lifeGame}
        <LifeGameBoard {lifeGame}/>
    {/if}
</main>

<style>
</style>
