import { readFile } from "../utils";

export function day1() {
    console.log("Day 1");
    const inputFile: string = readFile("../input/day_1.txt");
    console.log(`\tPart 1: ${partOne(inputFile)}`);
    console.log(`\tPart 2: ${partTwo(inputFile)}`);
}

function partOne(inputFile: string) {
    const lines: string[] = inputFile.split("\n");
    const sum = lines.reduce((prev, curr) => {
        const matches = findMatches(curr, new RegExp("\\d", "g"));
        return prev + Number(matches[0] + matches[matches.length - 1]);
    }, 0
    );
    return sum;
}

function partTwo(inputFile: string) {
    const map: Map<string, string> = new Map()
        .set("one", "1").set("two", "2")
        .set("three", "3").set("four", "4")
        .set("five", "5").set("six", "6")
        .set("seven", "7").set("eight", "8")
        .set("nine", "9");
    const keys: string[] = [...map.keys()];
    const regex = `(\\d)${keys.reduce((prev, curr) => `${prev}|(${curr})`, "")}`;

    const lines: string[] = inputFile.split("\n");
    const sum = lines.reduce((prev, curr) => {
        const matches = findMatches(curr, new RegExp(regex, "g"));
        const translatedMatches = matches.map(v => map.has(v) ? map.get(v) : v);
        return prev + Number(translatedMatches[0] + translatedMatches[translatedMatches.length - 1]);
    }, 0
    );
    return sum;
}

function findMatches(input: string, regex: RegExp): string[] {
    const matches: string[] = [];

    let execArray: RegExpExecArray;
    while ((execArray = regex.exec(input)) !== null) {
        const match: string = execArray[0];
        matches.push(match);
        regex.lastIndex = regex.lastIndex - (match.length - 1);
    }
    return matches;
}
