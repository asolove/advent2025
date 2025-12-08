import { counts, inputLines, PriorityQueue, product, UnionFind } from "../lib";

type Box = [number, number, number];

let lines = await inputLines();

// I moved the number of times to cycle through Part 1 to the input data file
// so that the code can be uniform for test and real data.
const TIMES = parseInt(lines[0], 10);

let boxes: Box[] = lines
  .slice(1)
  .map((line) => line.split(",").map((n) => parseInt(n, 10)) as Box);

let distance = (box1: Box, box2: Box): number => {
  let [x1, y1, z1] = box1;
  let [x2, y2, z2] = box2;

  return Math.sqrt(
    Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2)
  );
};

let q = new PriorityQueue<[number, number]>();

for (let i = 0; i < boxes.length; i++) {
  for (let j = 0; j < i; j++) {
    let box1 = boxes[i] as Box;
    let box2 = boxes[j] as Box;
    q.push([i, j], distance(box1, box2));
  }
}

let circuits = new UnionFind(boxes.length);

let connections = 0;
while (connections < TIMES) {
  let [i1, i2] = q.pop();
  let c1 = circuits.find(i1);
  let c2 = circuits.find(i2);
  connections++;

  if (c1 === c2) continue;

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
  let c1 = circuits.find(i1);
  let c2 = circuits.find(i2);
  connections++;

  if (c1 === c2) continue;

  circuits.union(i1, i2);
  if (currentCircuitCounts().size === 1) {
    console.log("Part Two", boxes[i1][0] * boxes[i2][0]);
    break;
  }
}
