import {ok, Result} from 'neverthrow';

declare const LifeGame: unique symbol;

type LifeGame = {
    grid: Grid;
    [LifeGame]: never;
};

type Grid = Row[];

type Row = Cell[];

type Cell = {
    isAlive: boolean;
};

export const createLifeGame = (rowSize: number, colSize: number): Result<LifeGame, Error> => {
    const grid = createGrid(rowSize)(colSize)();

    const lifeGame = $state({
        grid,
    });

    return ok(lifeGame as LifeGame);
};

const createGrid = (rowSize: number) => (colSize: number) => (): Grid => {
    return Array.from({length: rowSize}).map(createRow(colSize));
};

const createRow = (colSize: number) => (): Row => {
    return Array.from({length: colSize}).map(createCell);
};

const createCell = (): Cell => {
    return {
        isAlive: false,
    };
};

export const moveAhead = (lifeGame: LifeGame): void => {
    lifeGame.grid = computeNextGenerationGrid(lifeGame.grid);
};

export const computeNextGenerationGrid = (grid: Grid): Grid => {
    return grid.map((row, i) => {
        return row.map((cell, j) => {
            const isAlive = cellWillBeAlive(grid, i, j);
            return {
                isAlive,
            } satisfies Cell;
        });
    });
};

export const cellWillBeAlive = (grid: Grid, row: number, col: number): boolean => {
    // セルの生死状態
    const isAlive = cellIsAlive(grid, row, col);

    // 隣接するセルの生きたセルを数える
    const count = countLivingCellsAround(grid, row, col);

    if (isAlive) {
        // 生きているセルに隣接する生きたセルが1つ以下ならば、過疎により死滅する。
        // 生きているセルに隣接する生きたセルが2つか3つならば、次の世代でも生存する。
        // 生きているセルに隣接する生きたセルが4つ以上ならば、過密により死滅する。
        switch (count) {
            case 0:
            case 1:
                // 過疎
                return false;
            case 2:
            case 3:
                // 生存
                return true;
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            default:
                // 過密
                return false;
        }
    } else {
        // 死んでいるセルに隣接する生きたセルがちょうど3つあれば、次の世代が誕生する。
        switch (count) {
            case 0:
            case 1:
            case 2:
                return false;
            case 3:
                // 誕生
                return true;
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            default:
                return false;
        }
    }
};

export const cellIsAlive = (grid: Grid, row: number, col: number): boolean => {
    return grid[row][col].isAlive;
};

export const countLivingCellsAround = (grid: Grid, row: number, col: number): number => {
    const directions = [
        [-1, -1], [-1, +0], [-1, +1],
        [+0, -1],/*       */[+0, +1],
        [+1, -1], [+1, +0], [+1, +1],
    ] as const;

    return directions
        .filter(([rowDelta, colDelta]) => {
            const aroundRow = row + rowDelta;
            if (aroundRow < 0 || grid.length - 1 < aroundRow) {
                return false;
            }
            const aroundCol = col + colDelta;
            if (aroundCol < 0 || grid[aroundRow].length - 1 < aroundCol) {
                return false;
            }

            return grid[aroundRow][aroundCol].isAlive;
        })
        .length;
};

export const resetAll = (lifeGame: LifeGame): void => {
    lifeGame.grid = blankPatternGrid(lifeGame.grid);
};

const blankPatternGrid = (grid: Grid): Grid => {
    return renderPatternGrid(grid, []);
};

const renderPatternGrid = (grid: Grid, pattern: Pattern): Grid => {
    return grid.map((row, i) => {
        return row.map((cell, j) => {
            const isAlive = pattern[i]?.[j] === 1;
            return {
                isAlive,
            } satisfies Cell;
        });
    });
};

export const selectPresetPattern = (lifeGame: LifeGame): void => {
    const patterns = [
        blockPatternGrid,
        boatPatternGrid,
        beehivePatternGrid,
        loafPatternGrid,
        pondPatternGrid,
        mosaicPatternGrid,
    ];

    const index = Math.floor(Math.random() * patterns.length);

    lifeGame.grid = patterns[index](lifeGame.grid);
};

type Pattern = Dot[][];

type Dot = AliveDot | DeadDot;

type AliveDot = 1;

type DeadDot = 0;

// https://ja.wikipedia.org/wiki/ブロック_(ライフゲーム)
//
// ```
// □□□□
// □■■□
// □□■□
// □□□□
// ```
const blockPatternGrid = (grid: Grid): Grid => {
    const pattern: Pattern = [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 0],
    ];

    return renderPatternGrid(grid, pattern);
};

// https://ja.wikipedia.org/wiki/ボート_(ライフゲーム)
//
// ```
// □□□□□
// □■■□□
// □■□■□
// □□□■□
// □□□□□
// ```
const boatPatternGrid = (grid: Grid): Grid => {
    const pattern: Pattern = [
        [0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0],
        [0, 1, 0, 1, 0],
        [0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0],
    ];

    return renderPatternGrid(grid, pattern);
};

// https://ja.wikipedia.org/wiki/蜂の巣_(ライフゲーム)
//
// ```
// □□□□
// □■□□
// □■■□
// □□■□
// □□□□
// ```
const beehivePatternGrid = (grid: Grid): Grid => {
    const pattern: Pattern = [
        [0, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 0],
    ];

    return renderPatternGrid(grid, pattern);
};

// https://ja.wikipedia.org/wiki/パン_(ライフゲーム)
//
// ```
// □□□□□□
// □■■□□□
// □□■■□□
// □□□■□□
// □□□□□□
// ```
const loafPatternGrid = (grid: Grid): Grid => {
    const pattern: Pattern = [
        [0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 0, 0],
        [0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0],
    ];

    return renderPatternGrid(grid, pattern);
};

// https://ja.wikipedia.org/wiki/池_(ライフゲーム)
//
// ```
// □□□□□
// □□■□□
// □■■□□
// □□□■□
// □□□□□
// ```
const pondPatternGrid = (grid: Grid): Grid => {
    const pattern: Pattern = [
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 1, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0],
    ];

    return renderPatternGrid(grid, pattern);
};

// https://ja.wikipedia.org/wiki/モザイク_(ライフゲーム)
//
// ```
// □□□□□□□□□□□□□
// □■■□■■□■■□■■□
// □■■□■■□■■□■■□
// □□□■□□□□□■□□□
// □■■□■■□■■□■■□
// □■■□■■□■■□■■□
// □□□□□□□□□□□□□
// □■■□■■□■■□■■□
// □■■□■■□■■□■■□
// □□□■□□□□□■□□□
// □■■□■■□■■□■■□
// □■■□■■□■■□■■□
// □□□□□□□□□□□□□
// ```
const mosaicPatternGrid = (grid: Grid): Grid => {
    const pattern: Pattern = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
        [0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
        [0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
        [0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
        [0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    return renderPatternGrid(grid, pattern);
};

export const editCell = (lifeGame: LifeGame, row: number, col: number): void => {
    const current: Pattern = patternFromGrid(lifeGame.grid);
    const editing: Pattern = current.map((rowDots, i) => {
        return rowDots.map((dot, j) => {
            // 添字が一致しているときは生死状態を反転させる
            return row === i && col === j ? (dot * -1 + 1) as Dot : dot;
        });
    });

    lifeGame.grid = renderPatternGrid(lifeGame.grid, editing);
};

const patternFromGrid = (grid: Grid): Pattern => {
    return grid.reduce((gridDots, row) => {
        const dots = row.reduce((rowDots, cell) => {
            const dot: Dot = cell.isAlive ? 1 : 0;
            return [...rowDots, dot];
        }, [] as Dot[]);

        return [...gridDots, dots];
    }, [] as Pattern);
};
