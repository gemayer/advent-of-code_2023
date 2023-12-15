import { readFile } from "../utils";

export function day3() {
    console.log("Day 3");
    const inputFile: string = readFile("../input/day_3.txt");
    //const inputFile: string = readFile("../input/test.txt");
    console.log(`\tPart 1: ${partOne(inputFile)}`);
    console.log(`\tPart 2: ${partTwo(inputFile)}`);
}

function partOne(inputFile: string): number {
    const lines: string[] = inputFile.split("\n");

    let sum = 0;
    for (let iLine = 0; iLine < lines.length; iLine++) {
        const line = lines[iLine];
        const regex = RegExp("\\d+", "g");
        let match: RegExpExecArray;
        while ((match = regex.exec(line)) !== null) {
            const number = Number(match[0]);
            const startIndex = regex.lastIndex - match[0].length;
            const lastIndex = regex.lastIndex - 1;
            const symbolLocations = findNearBySymbolLocations("[^\\w\\.]", lines, iLine, startIndex, lastIndex);
            if (symbolLocations.length > 0) {
                sum += number;
            }
        }
    }
    return sum;
}

function partTwo(inputFile: string): number {
    const lines: string[] = inputFile.split("\n");

    const gearLocations: GearRatio[] = []
    for (let iLine = 0; iLine < lines.length; iLine++) {
        const line = lines[iLine];
        const regex = RegExp("\\d+", "g");
        let match: RegExpExecArray;
        while ((match = regex.exec(line)) !== null) {
            const number = Number(match[0]);
            const startIndex = regex.lastIndex - match[0].length;
            const lastIndex = regex.lastIndex - 1;
            const symbolLocations = findNearBySymbolLocations("\\*", lines, iLine, startIndex, lastIndex);
            for (const symbolLocation of symbolLocations) {
                let gearLocation = gearLocations.find((gearLocation) => symbolLocation.iRow === gearLocation.symbolLocation.iRow && symbolLocation.iCol === gearLocation.symbolLocation.iCol);
                if (!gearLocation) {
                    gearLocation = {
                        symbolLocation: symbolLocation,
                        matches: []
                    };
                    gearLocations.push(gearLocation);
                }
                gearLocation.matches.push(number);
            }
        }
    }

    return gearLocations.reduce((prev, curr) => {
        if (curr.matches.length === 2) {
            return prev + curr.matches[0] * curr.matches[1];
        }
        return prev;
    }, 0);
}

function findNearBySymbolLocations(regex: string, lines: string[], row: number, startCol: number, endCol: number): SymbolLocation[] {
    const symbolLocations = []
    for (let iCandidateRow = Math.max(0, row - 1); iCandidateRow <= Math.min(lines.length - 1, row + 1); iCandidateRow++) {
        for (let iCandidateCol = Math.max(0, startCol - 1); iCandidateCol <= Math.min(lines[row].length - 1, endCol + 1); iCandidateCol++) {
            if (lines[iCandidateRow].charAt(iCandidateCol).match(regex)) {
                symbolLocations.push({
                    iRow: iCandidateRow,
                    iCol: iCandidateCol
                });
            }
        }
    }
    return symbolLocations;
}

type SymbolLocation = {
    iRow: number;
    iCol: number;
}

type GearRatio = {
    symbolLocation: SymbolLocation,
    matches: number[]
}
