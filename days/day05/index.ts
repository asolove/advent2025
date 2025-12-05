import { input, max, min, sum } from "../lib";

type Problem = {
  fresh: [number, number][];
  ingredients: number[];
};

let parse = (input: string): Problem => {
  let [freshLines, ingredientLines] = input.split("\n\n");
  if (!freshLines || !ingredientLines) throw new Error("invalid input");

  let fresh: [number, number][] = freshLines
    .split("\n")
    .map((line) => line.split("-").map((n) => parseInt(n, 10))) as [
    number,
    number
  ][];

  let ingredients = ingredientLines.split("\n").map((n) => parseInt(n, 10));

  return {
    fresh,
    ingredients,
  };
};

let isFresh = (ingredient: number, fresh: [number, number][]): boolean => {
  for (const [min, max] of fresh) {
    if (min <= ingredient && ingredient <= max) {
      return true;
    }
  }
  return false;
};

let partOne = (problem: Problem): number => {
  let count = 0;
  for (const ingredient of problem.ingredients) {
    if (isFresh(ingredient, problem.fresh)) count++;
  }
  return count;
};

let partTwo = (problem: Problem): number => {
  let orderedRanges = problem.fresh.sort(([min1], [min2]) => min1 - min2);
  let mergedRanges: [number, number][] = [];
  let maxSeen = -1;
  orderedRanges.forEach(([min, max]) => {
    if (min > maxSeen + 1) {
      mergedRanges.push([min, max]);
      maxSeen = max;
    } else {
      let currentRange = mergedRanges[mergedRanges.length - 1];
      if (!currentRange) throw new Error("wtf");

      let currentMax = currentRange[1];
      maxSeen = Math.max(currentMax, max);
      currentRange[1] = maxSeen;
    }
  });
  return mergedRanges.map(([min, max]) => max - min + 1).reduce(sum);
};

let problem: Problem = parse(await input());
console.log("Part One:", partOne(problem));
console.log("Part Two:", partTwo(problem));
