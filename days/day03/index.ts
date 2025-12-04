import { inputLines, max, sum } from "../lib";

let lines = await inputLines();
let banks: number[][] = lines.map((line) =>
  line.split("").map((d) => parseInt(d, 10))
);

const maxJoltage2 = (bank: number[]): number => {
  let firstDigit = max(bank.slice(0, bank.length - 1));
  let firstDigitIndex = bank.indexOf(firstDigit);
  let lastDigit = max(bank.slice(firstDigitIndex + 1));
  return firstDigit * 10 + lastDigit;
};

const maxJoltageN = (bank: number[], n: number): number => {
  if (n === 0) return 0;

  let digit = max(bank.slice(0, bank.length - n + 1));
  let digitIndex = bank.indexOf(digit);

  return (
    digit * Math.pow(10, n - 1) + maxJoltageN(bank.slice(digitIndex + 1), n - 1)
  );
};

const partOne = (banks: number[][]) => banks.map(maxJoltage2).reduce(sum);

const partTwo = (banks: number[][]) =>
  banks.map((bank) => maxJoltageN(bank, 12)).reduce(sum);

console.log("Part One:", partOne(banks));
console.log("Part Two:", partTwo(banks));
