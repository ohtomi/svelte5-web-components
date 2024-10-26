import type {Unsubscriber} from 'svelte/store';
import {type Tweened, tweened} from 'svelte/motion';

declare const Ticker: unique symbol;

type Ticker = {
    delay: number;
    timer: Tweened<number>;
    isStarted: boolean;
    unsubscribe: Unsubscriber | undefined;
    [Ticker]: never;
};

export const newTicker = (delay: number): Ticker => {
    const timer = tweened(0, {duration: delay});

    const ticker = $state({
        delay,
        timer,
        isStarted: false,
        unsubscribe: undefined,
    });

    return ticker as Ticker;
};

export const startTicker = async (ticker: Ticker, func: () => void): Promise<void> => {
    await stopTicker(ticker);

    ticker.isStarted = true;
    ticker.unsubscribe = ticker.timer.subscribe(async (value) => {
        if (value < ticker.delay) {
            return;
        }

        func();

        await ticker.timer.update(() => 0, {duration: 0});
        await ticker.timer.set(ticker.delay);
    });

    await ticker.timer.update(() => 0, {duration: 0});
    await ticker.timer.set(ticker.delay);
};

export const stopTicker = async (ticker: Ticker): Promise<void> => {
    if (!ticker.isStarted) {
        return;
    }
    if (!ticker.unsubscribe) {
        return;
    }

    ticker.unsubscribe();

    ticker.isStarted = false;
    ticker.unsubscribe = undefined;

    await ticker.timer.update(() => 0, {duration: 0});
};
