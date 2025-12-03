import { input } from "../lib";

let text = await input();
let ranges = text
  .split(",")
  .map((part) => part.split("-").map((n) => parseInt(n, 10)));

function bruteForce(range: [number, number]): number {
  let [start, end] = range;
  let sum = 0;

  for (let n = start; n <= end; n++) {
    let s = n.toString();
    if (s.length % 2 !== 0) {
      continue;
    }
    if (s.substring(0, s.length / 2) === s.substring(s.length / 2)) {
      sum += n;
    }
  }
  return sum;
}

let sum = 0;
ranges.forEach((range) => (sum += bruteForce(range)));

console.log("Part 1", sum);

function splitEvery(s: string, l: number): string[] {
  let result = [];
  for (let i = 0; i < s.length; i += l) {
    result.push(s.substring(i, i + l));
  }
  return result;
}

function allEqual(vals: string[]): boolean {
  return vals.every((v) => v === vals[0]);
}

function bruteForcePart2(range: [number, number]): number {
  let [start, end] = range;
  let sum = 0;

  for (let n = start; n <= end; n++) {
    let s = n.toString();
    for (let l = 1; l <= s.length / 2; l++) {
      if (s.length % l !== 0) continue;
      let substrings = splitEvery(s, l);

      if (allEqual(substrings)) {
        sum += n;
        break;
      }
    }
  }
  return sum;
}

sum = 0;
ranges.forEach((range) => (sum += bruteForcePart2(range)));
console.log("Part 2", sum);
