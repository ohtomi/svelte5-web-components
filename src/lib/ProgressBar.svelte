<script lang="ts">
    import {newTicker} from './state';

    type Props = {
        ticker: ReturnType<typeof newTicker>;
    };

    let {ticker}: Props = $props();

    let timer = $derived(ticker.timer);

    let percentage = $derived($timer / ticker.delay * 100);
</script>

<div class="progress-bar" style={`--progress-bar-width: ${percentage}%;`}></div>

<style>
    .progress-bar {
        width: var(--progress-bar-width);
        height: 100%;
        background-color: #646cff;
    }
</style>
