import { readFile } from "../utils";

export function day2() {
    console.log("Day 2");
    const inputFile: string = readFile("../input/day_2.txt");
    console.log(`\tPart 1: ${partOne(inputFile)}`);
    console.log(`\tPart 2: ${partTwo(inputFile)}`);
}

function partOne(inputFile: string): number {
    const lines: string[] = inputFile.split("\n");

    const blueMax = 14, greenMax = 13, redMax = 12;
    const sum = lines.reduce((prev, curr) => {
        const game = parseGame(curr);
        for (const set of game.sets) {
            if ((set.blue > blueMax || set.green > greenMax || set.red > redMax)) {
                return prev;
            }
        }
        return prev + game.id;
    }, 0);

    return sum;
}

function partTwo(inputFile: string): number {
    const lines: string[] = inputFile.split("\n");

    const sum = lines.reduce((prev, curr) => {
        const game = parseGame(curr);
        const minimum = {
            blue: 0,
            green: 0,
            red: 0,
        }
        for (const set of game.sets) {
            minimum.blue = Math.max(minimum.blue, set.blue);
            minimum.green = Math.max(minimum.green, set.green);
            minimum.red = Math.max(minimum.red, set.red);
        }

        return prev + (minimum.blue * minimum.green * minimum.red);
    }, 0);

    return sum;
}

function parseGame(line: string): Game {
    const match = line.match("^Game (\\d+):(.*)$");
    return {
        raw: line,
        id: Number(match[1]),
        sets: parseSets(match[2])
    };
}

function parseSets(setLine: string): GameSet[] {
    const sets: GameSet[] = [];
    const setLines = setLine.split(";");
    for (let i = 0; i < setLines.length; i++) {
        const blueMatch = setLines[i].match("(\\d*)(?= blue)");
        const greenMatch = setLines[i].match("(\\d*)(?= green)");
        const redMatch = setLines[i].match("(\\d*)(?= red)");
        const set: GameSet = {
            raw: setLines[i],
            id: i,
            blue: blueMatch ? Number(blueMatch[1]) : 0,
            green: greenMatch ? Number(greenMatch[1]) : 0,
            red: redMatch ? Number(redMatch[1]) : 0,
        }
        sets.push(set);
    }
    return sets;
}

type Game = {
    raw: string;
    id: number;
    sets: GameSet[];
}

type GameSet = {
    raw: string;
    id: number;
    green: number;
    blue: number;
    red: number;
}

type GameSetMin = {
    power: number;
    green: number;
    blue: number;
    red: number;
}