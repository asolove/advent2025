import { inputLines, sum } from "../lib";

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
  // The logic here is simple: the graph doesn't have cycles, so every valid path has to either be:
  //   - svr -> fft -> dac -> out
  //   - svr -> dac -> fft -> out
  // And only one of these will actualy exist, but I don't know which from scractch, so:
  return (
    paths(maze, "svr", "fft") *
      paths(maze, "fft", "dac") *
      paths(maze, "dac", "out") +
    paths(maze, "svr", "dac") *
      paths(maze, "dac", "fft") *
      paths(maze, "fft", "out")
  );
};

let paths = (
  maze: Map<string, string[]>,
  start: string,
  end: string
): number => {
  let pathsCache = new Map<string, number>();

  let pathsFrom = (from: string): number => {
    if (from === end) return 1;
    if (pathsCache.has(from)) return pathsCache.get(from) as number;

    let count = (maze.get(from) || []).map(pathsFrom).reduce(sum, 0);
    pathsCache.set(from, count);
    return count;
  };

  return pathsFrom(start);
};

console.log("Part 2", partTwo(maze));
