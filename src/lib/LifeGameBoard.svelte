<script lang="ts">
    import {onDestroy} from 'svelte';
    import type {UnResultOk} from './results';
    import {
        createLifeGame,
        editCell,
        moveAhead,
        newTicker,
        resetAll,
        selectPresetPattern,
        startTicker,
        stopTicker,
    } from './state/';
    import ProgressBar from './ProgressBar.svelte';

    type Props = {
        lifeGame: UnResultOk<ReturnType<typeof createLifeGame>>;
        gridColor: string;
        aliveCellColor: string;
        deadCellColor: string;
        cellSize: string;
    };

    let {
        lifeGame,
        cellSize,
        gridColor,
        aliveCellColor,
        deadCellColor,
    }: Props = $props();

    const handleMoveAhead = () => {
        moveAhead(lifeGame);
    };

    let ticker = newTicker(500);

    const handleStartTicker = () => {
        startTicker(ticker, () => {
            moveAhead(lifeGame);
        });
    };

    const handleStopTicker = () => {
        stopTicker(ticker);
    };

    const handleSelectPresetPattern = () => {
        selectPresetPattern(lifeGame);
    };

    const handleResetAll = () => {
        resetAll(lifeGame);
    };

    const handleEditCell = (row: number, col: number) => {
        if (isEditCellDisabled) {
            return;
        }
        editCell(lifeGame, row, col);
    };

    let isMoveAheadButtonDisabled = $derived(ticker.isStarted);
    let isStartTickerButtonDisabled = $derived(ticker.isStarted);
    let isStopTickerButtonDisabled = $derived(!ticker.isStarted);
    let isSelectPresetPatternButtonDisabled = $derived(ticker.isStarted);
    let isResetAllButtonDisabled = $derived(ticker.isStarted);
    let isEditCellDisabled = $derived(ticker.isStarted);

    onDestroy(() => {
        stopTicker(ticker);
    });
</script>

<div class="board">
    <div class="grid"
         style={`
            --cell-size: ${cellSize};
            --grid-color: ${gridColor};
            --alive-cell-color: ${aliveCellColor};
            --dead-cell-color: ${deadCellColor};
         `}
    >
        {#each lifeGame.grid as row, i}
            {#each row as col, j}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <div class="cell"
                     class:alive={col.isAlive}
                     style="grid-row: {i + 1}; grid-column: {j + 1};"
                     role="button"
                     tabindex="-1"
                     onclick={() => handleEditCell(i, j)}
                ></div>
            {/each}
        {/each}
    </div>
    <div class="progress">
        <ProgressBar {ticker}/>
    </div>
    <div class="controls">
        <button onclick={handleMoveAhead}
                disabled={isMoveAheadButtonDisabled}
        >
            ターンを進める
        </button>
        <button onclick={handleStartTicker}
                disabled={isStartTickerButtonDisabled}
        >
            タイマーを起動する（自動でターンを進める）
        </button>
        <button onclick={handleStopTicker}
                disabled={isStopTickerButtonDisabled}
        >
            タイマーを停止する
        </button>
        <button onclick={handleSelectPresetPattern}
                disabled={isSelectPresetPatternButtonDisabled}
        >
            プリセットを描画する
        </button>
        <button onclick={handleResetAll}
                disabled={isResetAllButtonDisabled}
        >
            リセットする
        </button>
    </div>
</div>

<style>
    .board {
        display: grid;
        grid-gap: 10px;
    }

    .grid {
        display: grid;
        background-color: var(--grid-color);
        grid-gap: 1px 1px;
        border: solid 1px var(--grid-color);
    }

    .cell {
        width: var(--cell-size);
        height: var(--cell-size);
        background-color: var(--dead-cell-color);
    }

    .cell.alive {
        background-color: var(--alive-cell-color);
    }

    .progress {
        width: 100%;
        height: 6px;
        border-radius: 3px;
        overflow: hidden;
    }

    .controls {
        display: grid;
        grid-gap: 5px;
    }

    button {
        border-radius: 8px;
        border: 1px solid transparent;
        padding: 0.6em 1.2em;
        font-size: 1em;
        font-weight: 500;
        font-family: inherit;
        background-color: #1a1a1a;
        cursor: pointer;
        transition: border-color 0.25s;
    }

    button:hover {
        border-color: #646cff;
    }

    button:focus,
    button:focus-visible {
        outline: 4px auto -webkit-focus-ring-color;
    }

    @media (prefers-color-scheme: light) {
        button {
            background-color: #f9f9f9;
        }
    }
</style>
