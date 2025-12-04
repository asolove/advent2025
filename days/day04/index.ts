import { inputLines } from "../lib";

let lines = await inputLines();
let grid = lines.map((line) =>
  line.split("").map((c) => (c === "." ? false : true))
);

let partOne = (grid: boolean[][]) => {
  let reachable: [number, number][] = [];
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[0].length; row++) {
      if (!grid[col][row]) continue;

      let occupied = 0;
      [-1, 0, 1].forEach((dc) => {
        [-1, 0, 1].forEach((dr) => {
          let r = row + dr;
          let c = col + dc;

          if (r === row && c === col) return;
          if (r < 0 || r >= grid[0].length) return;
          if (c < 0 || c >= grid.length) return;

          if (grid[c][r]) occupied++;
        });
      });

      if (occupied < 4) reachable.push([col, row]);
    }
  }
  return reachable;
};

let removeRolls = (grid: boolean[][], toRemove: [number, number][]) => {
  let r = JSON.parse(JSON.stringify(grid));
  toRemove.forEach(([col, row]) => {
    if (!r[col][row])
      throw new Error(
        `Trying to remove roll that isn't present at [${col}, ${row}]`
      );
    r[col][row] = false;
  });
  return r;
};

let partTwo = (grid: boolean[][]) => {
  let removed = 0;
  let currentGrid = grid;
  while (true) {
    let removable = partOne(currentGrid);
    if (removable.length === 0) break;

    removed += removable.length;
    currentGrid = removeRolls(currentGrid, removable);
  }
  return removed;
};

console.log("Part One:", partOne(grid).length);
console.log("Part Two:", partTwo(grid));
