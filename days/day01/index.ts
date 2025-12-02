import { inputLines } from "../lib";

let lines = await inputLines();
let problem = lines.map(
  (line) => (line[0] === "L" ? -1 : 1) * parseInt(line.substr(1))
);

let state = 50;
let stopsAtZero = 0;
let visitsZero = 0;
for (let step of problem) {
  let click = step / Math.abs(step);
  for (let i = 0; i != step; i += click) {
    state += click;
    state = (state + 100) % 100;
    if (state === 0) visitsZero++;
  }
  if (state === 0) stopsAtZero++;
}

console.log("Part 1", stopsAtZero);
console.log("Part 2", visitsZero);
