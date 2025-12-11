import { inputLines } from "../lib";

let lines = await inputLines();

let start: string = "you";
let maze = new Map<string, string[]>();
lines.forEach((line) => {
  let [label, rest] = line.split(": ") as [string, string];
  let nexts = rest.split(" ");
  maze.set(label, nexts);
});

let partOne = (maze: Map<string, string[]>): number => {
  let q = [start];
  let count = 0;

  while (true) {
    let node = q.pop();

    if (!node) break;
    if (node === "out") {
      count++;
      continue;
    }

    for (let dest of maze.get(node) || []) q.push(dest);
  }
  return count;
};

console.log("Part 1", partOne(maze));

let partTwo = (maze: Map<string, string[]>): number => {
  type state = [string, boolean, boolean]; // [current, visitedDAC, visitedFFT]
  let q: state[] = [["svr", false, false]];
  let count = 0;
  let i = 0;

  while (true) {
    if (i % 100 === 0) console.log(q);
    i++;
    let state = q.pop();

    if (!state) break;
    let [node, visitedDAC, visitedFFT] = state;

    if (node === "out") {
      if (visitedDAC && visitedFFT) count++;
      continue;
    }

    for (let dest of maze.get(node) || []) {
      q.push([
        dest,
        visitedDAC || node === "dac",
        visitedFFT || node === "fft",
      ]);
    }
  }
  return count;
};

console.log("Part 2", partTwo(maze));
