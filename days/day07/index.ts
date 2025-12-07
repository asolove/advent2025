import { inputLines, sum, unique } from "../lib";

let partOne = (grid: string[][]): number => {
  let splits = 0;
  let beams = [grid[0].indexOf("S")];

  for (let i = 1; i < grid.length; i++) {
    beams = unique(
      beams.flatMap((col) => {
        if (grid[i][col] === "^") {
          splits++;
          return [col - 1, col + 1];
        }
        return [col];
      })
    );
  }
  return splits;
};

let partTwo = (grid: string[][]): number => {
  let startCol = grid[0].indexOf("S");
  let particles = new Map();
  particles.set(startCol, 1);

  for (let i = 1; i < grid.length; i++) {
    let newParticles = new Map();
    particles.forEach((count, col) => {
      if (grid[i][col] === "^") {
        newParticles.set(col - 1, (newParticles.get(col - 1) || 0) + count);
        newParticles.set(col + 1, (newParticles.get(col + 1) || 0) + count);
      } else {
        newParticles.set(col, (newParticles.get(col) || 0) + count);
      }
    });
    particles = newParticles;
  }
  return particles.values().reduce(sum);
};
let grid = (await inputLines()).map((line) => line.split(""));

console.log("Part One:", partOne(grid));
console.log("Part Two:", partTwo(grid));
