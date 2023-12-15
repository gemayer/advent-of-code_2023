import { readFile } from "../utils";

export function day4() {
    console.log("Day 4");
    const inputFile: string = readFile("../input/day_4.txt");
    //const inputFile: string = readFile("../input/test.txt");
    console.log(`\tPart 1: ${partOne(inputFile)}`);
    console.log(`\tPart 2: ${partTwo(inputFile)}`);
}

function partOne(inputFile: string): number {
    const lines: string[] = inputFile.split("\n");

    let sum = 0;
    for (let iLine = 0; iLine < lines.length; iLine++) {
        const game = parseGame(lines[iLine]);
        const numberOfWinners = evaluateNumberOfWinners(game);
        sum += (numberOfWinners !== 0) ? Math.pow(2,(numberOfWinners - 1)) : 0;
    }
    return sum;
}

function partTwo(inputFile: string): number {
    const lines: string[] = inputFile.split("\n");

    let numberOfCards = 0;
    let copies: number[] = Array(lines.length).fill(1);
    for (let iLine = 0; iLine < lines.length; iLine++) {
        const game = parseGame(lines[iLine]);
        const numberOfWinners = evaluateNumberOfWinners(game);
        for (let iWinner = 1; iWinner <= numberOfWinners; iWinner++) {
            copies[iLine + iWinner] += copies[iLine];
        }
        numberOfCards += copies[iLine];
    }
    return numberOfCards;
}

function parseGame(raw: string) : Game {
    const match = raw.match("^Card\\s+(\\d+):([\\s\\d]+)\\|([\\s\\d]+)$");
    return {
        raw: raw,
        id: Number(match[1]),
        winners: new Set(match[2].trim().split(RegExp("\\s+")).map(i => Number(i))),
        myNumbers: new Set(match[3].trim().split(RegExp("\\s+")).map(i => Number(i))),
    }
}

function evaluateNumberOfWinners(game : Game) : number {
    const myWinners = [...game.myNumbers].filter(n => game.winners.has(n));
    return myWinners.length;
}

type Game = {
    raw: string;
    id: number;
    winners: Set<number>;
    myNumbers: Set<number>;
}
