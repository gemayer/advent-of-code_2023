import { readFile } from "../utils";

export function day5() {
    console.log("Day 5");
    const inputFile: string = readFile("../input/day_5.txt");
    //const inputFile: string = readFile("../input/test.txt");
    console.log(`\tPart 1: ${partOne(inputFile)}`);
    console.log(`\tPart 2: ${partTwo(inputFile)}`);
}

function partOne(inputFile: string): number {
    const almanac = parseAlmanac(inputFile, (line) => {
        return line.match("^seeds\\:\\s*([\\d\\s]+)$")[1].trim().split(RegExp("\\s+")).map(n => {
            const start = Number(n);
            const seed: Seed = { interval: { start_inclusive: start, end_exclusive: start + 1 } };
            return seed;
        });
    });
    fillMissingAlmanacIntervals(almanac);
    let minimum = almanac.seeds.reduce((currentMin, seed) => Math.min(currentMin, findMinimumDestinationMapping(seed.interval, "seed", "location", almanac)), Number.MAX_SAFE_INTEGER);
    return minimum;
}

function partTwo(inputFile: string): number {
    const almanac = parseAlmanac(inputFile, (line) => {
        const numbers = line.match("^seeds\\:\\s*([\\d\\s]+)$")[1].trim().split(RegExp("\\s+"));
        const seeds: Seed[] = [];
        for (let iNumber = 0; iNumber < numbers.length; iNumber += 2) {
            const start = Number(numbers[iNumber]);
            const range = Number(numbers[iNumber + 1]);
            seeds.push({
                interval: { start_inclusive: start, end_exclusive: start + range }
            });
        }
        return seeds;
    });
    fillMissingAlmanacIntervals(almanac);
    let minimum = almanac.seeds.reduce((currentMin, seed) => Math.min(currentMin, findMinimumDestinationMapping(seed.interval, "seed", "location", almanac)), Number.MAX_SAFE_INTEGER);
    return minimum;
}

function parseAlmanac(inputFile: string, seedFn: (line) => Seed[]): Almanac {
    const lines: string[] = inputFile.split("\n");

    const almanac: Almanac = {
        seeds: seedFn(lines[0]),
        maps: []
    };

    for (let iLine = 1; iLine < lines.length; iLine++) {
        if (lines[iLine].trim().length === 0) {
            continue;
        }
        const matches = lines[iLine].match("^(\\w*)\\-to\\-(\\w*) map\\:$");
        const almanacMap: AlmanacMap = {
            sourceCategory: matches[1],
            destinationCategory: matches[2],
            intervals: []
        }
        while ((iLine < lines.length - 1) && lines[iLine + 1].trim().length !== 0) {
            const mapNumbers = lines[iLine + 1].split(RegExp("\\s+")).map(n => Number(n));
            almanacMap.intervals.push({
                interval: {
                    start_inclusive: mapNumbers[1],
                    end_exclusive: mapNumbers[1] + mapNumbers[2]
                },
                shift: mapNumbers[0] - mapNumbers[1]
            });
            iLine++;
        }
        almanac.maps.push(almanacMap);
    }
    return almanac;
}

function fillMissingAlmanacIntervals(almanac: Almanac) {
    for (const almanacMap of almanac.maps) {
        const intervals = almanacMap.intervals.sort((a, b) => a.interval.start_inclusive - b.interval.start_inclusive);
        let candidateStartInterval = Number.MIN_SAFE_INTEGER;
        const toBeAddedIntervals: AlmanacMapInterval[] = [];
        for (let iInterval = 0; iInterval <= intervals.length; iInterval++) {
            let candidateEndInterval = null;
            if (iInterval === intervals.length) {
                candidateEndInterval = Number.MAX_SAFE_INTEGER;
            } else if (candidateStartInterval !== intervals[iInterval].interval.start_inclusive) {
                candidateEndInterval = intervals[iInterval].interval.start_inclusive;
            }
            if (candidateEndInterval !== null) {
                toBeAddedIntervals.push({
                    interval: {
                        start_inclusive: candidateStartInterval,
                        end_exclusive: candidateEndInterval
                    },
                    shift: 0
                });
            }
            if (iInterval < intervals.length) {
                candidateStartInterval = intervals[iInterval].interval.end_exclusive
            }
        }
        almanacMap.intervals.push(...toBeAddedIntervals);
    }
}


function findMinimumDestinationMapping(interval: Interval, source: string, destination: string, almanac: Almanac): number {
    if (source === destination) {
        return interval.start_inclusive;
    }
    const almanacMap = almanac.maps.find(m => m.sourceCategory === source);
    const almanacMapInterval = almanacMap.intervals.find(m => interval.start_inclusive >= m.interval.start_inclusive && interval.start_inclusive < m.interval.end_exclusive);
    const nextSourceCategory = almanacMap.destinationCategory;
    if (almanacMapInterval.interval.end_exclusive >= interval.end_exclusive) {
        const nextInterval: Interval = {
            start_inclusive: interval.start_inclusive + almanacMapInterval.shift,
            end_exclusive: interval.end_exclusive + almanacMapInterval.shift,
        }
        return findMinimumDestinationMapping(nextInterval, nextSourceCategory, destination, almanac);
    } else {
        const nextCategoryInterval: Interval = {
            start_inclusive: interval.start_inclusive + almanacMapInterval.shift,
            end_exclusive: almanacMapInterval.interval.end_exclusive + almanacMapInterval.shift,
        }
        const currentCategoryInterval: Interval = {
            start_inclusive: almanacMapInterval.interval.end_exclusive,
            end_exclusive: interval.end_exclusive
        }
        return Math.min(findMinimumDestinationMapping(nextCategoryInterval, nextSourceCategory, destination, almanac),
            findMinimumDestinationMapping(currentCategoryInterval, source, destination, almanac));
    }
}



type Almanac = {
    seeds: Seed[];
    maps: AlmanacMap[];
}

type Seed = {
    interval: Interval
}

type AlmanacMap = {
    sourceCategory: string;
    destinationCategory: string;
    intervals: AlmanacMapInterval[]
}

type AlmanacMapInterval = {
    interval: Interval;
    shift: number;
}

type Interval = {
    start_inclusive: number;
    end_exclusive: number;
}

