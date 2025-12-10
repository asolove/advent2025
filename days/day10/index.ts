import { fromBits, inputLines, sum, toBits } from "../lib";
import {
  bind,
  char,
  digit,
  int,
  many1,
  parse,
  result,
  sat,
  separatedBy,
  seq,
  surroundedBy,
  type Parser,
} from "../lib/parse";

type Machine = {
  len: number;
  lights: number;
  buttons: number[];
  joltages: number[];
};

const light: Parser<boolean> = bind(
  sat((c) => c === "." || c === "#"),
  (c: string) => result(c === "#")
);
const lights: Parser<boolean[]> = surroundedBy(
  many1(light),
  char("["),
  char("]")
);

const numbers: Parser<number[]> = separatedBy(int, char(","));
const button: Parser<number[]> = surroundedBy(numbers, char("("), char(")"));
const buttons: Parser<number[][]> = separatedBy(button, char(" "));

const joltages = surroundedBy(numbers, char("{"), char("}"));

const machine: Parser<Machine> = bind(
  seq(seq(lights, char(" ")), seq(seq(buttons, char(" ")), joltages)),
  ([[lights, _space], [[buttons, _space2], joltages]]) =>
    result({
      len: lights.length,
      lights: toBits(lights),
      buttons: buttons.map((button) =>
        toBits(
          Array(lights.length)
            .fill(false)
            .map((_n, i) => button.includes(i))
        )
      ),
      joltages,
    })
);

let machines: Machine[] = (await inputLines()).map((line) =>
  parse(machine, line)
);

const minPresses = (m: Machine, i: number): number => {
  let states = new Set([0]);
  for (let presses = 0; presses < m.buttons.length; presses++) {
    let nextStates = new Set<number>();
    for (let state of states) {
      if (state === m.lights) return presses;

      for (let button of m.buttons) nextStates.add(pressButton(state, button));
    }
    states = nextStates;
  }
  return NaN;
};

const pressButton = (state: number, button: number): number => state ^ button;

console.log("Part 1", machines.map(minPresses).reduce(sum));
