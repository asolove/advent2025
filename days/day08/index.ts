import { counts, inputLines, PriorityQueue, product, UnionFind } from "../lib";

type Box = [number, number, number];

let lines = await inputLines();

// I moved the number of times to cycle through Part 1 to the input data file
// so that the code can be uniform for test and real data.
const TIMES = parseInt(lines[0] as string, 10);

let boxes: Box[] = lines
  .slice(1)
  .map((line) => line.split(",").map((n) => parseInt(n, 10)) as Box);

let distance = ([x1, y1, z1]: Box, [x2, y2, z2]: Box): number =>
  Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));

// Order the box pairings by distance
let q = new PriorityQueue<[number, number]>();
for (let i = 0; i < boxes.length; i++) {
  for (let j = 0; j < i; j++) {
    let box1 = boxes[i] as Box;
    let box2 = boxes[j] as Box;
    q.push([i, j], distance(box1, box2));
  }
}

let circuits = new UnionFind(boxes.length);

for (let i = 0; i < TIMES; i++) {
  let [i1, i2] = q.pop();
  circuits.union(i1, i2);
}

let currentCircuitCounts = () => {
  let cs = [];
  for (let i = 0; i < boxes.length; i++) {
    cs[i] = circuits.find(i);
  }
  return counts(cs);
};

let circuitSizes = [...currentCircuitCounts().values()];
circuitSizes.sort((a, b) => b - a);
console.log("Part 1", circuitSizes.slice(0, 3).reduce(product));

while (true) {
  let [i1, i2] = q.pop();
  circuits.union(i1, i2);
  if (currentCircuitCounts().size === 1) {
    console.log("Part Two", boxes[i1][0] * boxes[i2][0]);
    break;
  }
}
