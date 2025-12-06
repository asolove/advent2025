import { inputLines, product, sum, tap, transpose } from "../lib";

let lines = await inputLines();

let partOne = (lines: string[]) => {
  let grid = lines.map((line) => line.trim().split(/\s+/));
  let numberLines = grid
    .slice(0, grid.length - 1)
    .map((line) => line.map((n) => parseInt(n, 10)));
  let ops = grid.slice(grid.length - 1)[0];

  let result = 0;
  for (let i = 0; i < numberLines[0].length; i++) {
    let args = numberLines.map((l) => l[i]);
    let op = ops[i] === "*" ? product : sum;
    let columnTotal = args.reduce(op);
    result += columnTotal;
  }
  return result;
};

let partTwo = (lines: string[]) => {
  let numberGrid = transpose(
    lines.slice(0, lines.length - 1).map((l) => l.split(""))
  ).map((l) => parseInt(l.join("").trim(), 10) || -1);
  let problemNumbers = splitAt(numberGrid, -1);
  let ops = lines
    .slice(lines.length - 1)[0]
    .trim()
    .split(/\s+/);

  let result = 0;
  for (let i = 0; i < problemNumbers.length; i++) {
    let args = problemNumbers[i];
    let op = ops[i] === "*" ? product : sum;
    let columnTotal = args.reduce(op);
    result += columnTotal;
  }
  return result;
};

let splitAt = <A>(arr: A[], item: A): A[][] => {
  let r = [];
  let from = 0;
  while (true) {
    let next = arr.indexOf(item, from);
    if (next === -1) {
      r.push(arr.slice(from));
      break;
    } else {
      r.push(arr.slice(from, next));
      from = next + 1;
    }
  }
  return r;
};

console.log("Part One:", partOne(lines));
console.log("Part Two:", partTwo(lines));
