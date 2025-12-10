import { inputLines } from "../lib";

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

let key = (x: number, y: number): string => `${x},${y}`;
let val = (key: string) =>
  key.split(",").map((x) => parseInt(x, 10)) as [number, number];

const border: Map<string, boolean> = new Map();

let prevPoint = tiles[tiles.length - 1];
tiles.forEach((currPoint) => {
  let [px, py] = prevPoint;
  let [cx, cy] = currPoint;

  if (py === cy) {
    let step = (cx - px) / Math.abs(cx - px);
    for (let x = px; x < cx; x += step) {
      border.set(key(x, cy), true);
    }
  } else if (px === cx) {
    let step = (cy - py) / Math.abs(cy - py);
    for (let y = py; y < cy; y += step) {
      border.set(key(cx, y), true);
    }
  } else {
    throw new Error(`Unsure how points connect: ${prevPoint} -> ${currPoint}`);
  }
  prevPoint = currPoint;
});

let [minX, maxX] = [Infinity, -Infinity];
let [minY, maxY] = [Infinity, -Infinity];

for (const [x, y] of tiles) {
  if (x < minX) minX = x;
  if (x > maxX) maxX = x;

  if (y < minY) minY = y;
  if (y > maxY) maxY = y;
}
minX -= 1;
minY -= 1;
maxX += 1;
maxY += 1;

// flood fill
let queue = [
  key(minX, minY),
  key(minX, maxY),
  key(maxX, minY),
  key(maxX, maxY),
];

let outside = new Map<string, boolean>();

while (queue.length > 0) {
  let k = queue.pop() as string;
  let [x, y] = val(k);
  if (x < minX || x > maxX || y < minY || y > maxY) continue;
  if (outside.has(k)) continue;
  if (border.has(k)) continue;

  outside.set(k, true);
  queue.push(
    ...[
      [x, y - 1],
      [x, y + 1],
      [x - 1, y],
      [x + 1, y],
    ].map(([x, y]: [number, number]) => key(x, y))
  );
}

console.log(outside.size);

let perimeterKeys = (
  x1: number,
  x2: number,
  y1: number,
  y2: number
): string[] => {
  let r = [];

  let xStep = (x2 - x1) / Math.abs(x2 - x1);
  let yStep = (y2 - y1) / Math.abs(y2 - y1);

  // x1, y1->y2
  // x2, y1->y2
  // x1->x2, y1
  // x1->x2, y2

  let step = (cx - px) / Math.abs(cx - px);
  for (let x = px; x < cx; x += step) {
    border.set(key(x, cy), true);
  }

  return r;
};

max = 0;
for (let i = 0; i < tiles.length; i++) {
  let [x1, y1] = tiles[i];
  for (let j = 0; j < i; j++) {
    let [x2, y2] = tiles[j];

    // find if allowed: only after checking area is greater since that's cheap
    // let p = perimiter(x1, x2, y1, y2);
    // let allowed = perimeter.
    let area = (Math.abs(y2 - y1) + 1) * (Math.abs(x2 - x1) + 1);
    if (area > max) max = area;
  }
}
