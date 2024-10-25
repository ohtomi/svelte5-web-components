declare const Ticker: unique symbol;

type Ticker = {
    delay: number;
    isStarted: boolean;
    intervalId: number | undefined;
    [Ticker]: never;
};

export const newTicker = (delay: number): Ticker => {
    const ticker = $state({
        delay,
        isStarted: false,
        intervalId: undefined,
    });

    return ticker as Ticker;
};

export const startTicker = (ticker: Ticker, func: () => void): void => {
    stopTicker(ticker);

    ticker.isStarted = true;
    ticker.intervalId = setInterval(func, ticker.delay);
};

export const stopTicker = (ticker: Ticker): void => {
    if (!ticker.isStarted) {
        return;
    }

    clearInterval(ticker.intervalId);

    ticker.isStarted = false;
    ticker.intervalId = undefined;
};
