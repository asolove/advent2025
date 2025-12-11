import { cross, inputLines } from "../lib";

const tiles: [number, number][] = (await inputLines()).map(
  (line) => line.split(",").map((n) => parseInt(n, 10)) as [number, number]
);

let max = 0;
for (let i = 0; i < tiles.length; i++) {
  let [x1, y1] = tiles[i];
  for (let j = 0; j < i; j++) {
    let [x2, y2] = tiles[j];
    let area = (Math.abs(y2 - y1) + 1) * (Math.abs(x2 - x1) + 1);
    if (area > max) max = area;
  }
}

console.log("Part One", max);

// Key idea: need to reduce an n^2 area problem into something linear with perimeters.
// Trace the perimeter of the tiled space.
//   Track an ordered list per column, e.g. (x=1) => [10, 20, 30, 40];
//   - Each pair of numbers in the list forms a range of allowed spaces: 10-20, 30-40.
//  Then test each possible square's perimeter. If every space in the perimeter
//     falls in an allowed range for its column, the square is allowed.

const columnIntersections: Map<number, [number, boolean][]> = new Map();

let prevPoint = tiles[tiles.length - 1];
tiles.forEach((currPoint) => {
  let [px, py] = prevPoint;
  let [cx, cy] = currPoint;

  if (py === cy) {
    let goingRight = cx > px;
    for (let x = Math.min(px, cx); x <= Math.max(px, cx); x++) {
      let col = columnIntersections.get(x);
      if (!col) {
        col = [];
        columnIntersections.set(x, col);
      }
      col.push([cy, goingRight]);
    }
  } else if (px === cx) {
  } else {
    throw new Error(`Unsure how points connect: ${prevPoint} -> ${currPoint}`);
  }
  prevPoint = currPoint;
});

let columnRanges = new Map(
  columnIntersections.entries().map(([col, intersections]) => {
    let ranges: number[] = [];
    let currentStart: number = Infinity;
    let currentEnd: number = -Infinity;

    for (let [y, goingRight] of intersections.toSorted((a, b) => a[0] - b[0])) {
      if (goingRight) {
        // New range
        if (currentEnd !== -Infinity) {
          ranges.push(currentStart, currentEnd + 1);
          currentStart = Infinity;
          currentEnd = -Infinity;
        }
        if (currentStart === Infinity) currentStart = y;
      } else {
        currentEnd = y;
      }
    }
    ranges.push(currentStart, currentEnd + 1);

    return [col, ranges];
  })
);

let isAllowed = (x: number, y: number): boolean => {
  let yRanges = columnRanges.get(x);
  if (!yRanges) throw new Error("No range known for column: " + x);
  let i = yRanges.findIndex((cy) => cy > y);
  return i % 2 === 1;
};

let perimeter = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): [number, number][] => {
  let r: [number, number][] = [];
  // FIXME: could avoid listing corners twice
  r.push(...line(x1, y1, x1, y2));
  r.push(...line(x1, y2, x2, y2));
  r.push(...line(x2, y2, x2, y1));
  r.push(...line(x2, y1, x1, y1));
  return r;
};

let line = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): [number, number][] => cross(fromTo(x1, x2), fromTo(y1, y2));

let fromTo = (from: number, to: number) => {
  let r = [];
  for (let i = Math.min(from, to); i <= Math.max(from, to); i++) r.push(i);
  return r;
};

max = 0;
for (let i = 0; i < tiles.length; i++) {
  let [x1, y1] = tiles[i];
  for (let j = 0; j < i; j++) {
    let [x2, y2] = tiles[j];
    let area = (Math.abs(y2 - y1) + 1) * (Math.abs(x2 - x1) + 1);

    if (area <= max) continue;

    let p = perimeter(x1, y1, x2, y2);
    let inTiles = p.every(([x, y]) => isAllowed(x, y));

    if (inTiles) max = area;
  }
}

console.log("Part Two", max);
