/*

The problem:

When writing AOC solutions, I dive in to writing the code directly without much abstraction or helpers.

Then I get stuck: there's a small bug, I don't understand the behavior in a certain case, or the runtime is too long.

Now I want to go poke at the state of the program partway through, 
but my logic is so bare-bones that there isn't an obvious place to stick a debugger.

Or I need to look at a number of examples, so a debugger is too manual and I really want an easy way to 
see "what did I consider doing and actually decide to do in these three cases"

Or the runtime is slow but the logic is hard to wrap in timers.


A possible solution:

A structured "what am I doing" framework that is easy to follow when writing the code and gets me
the hooks I need to add in conditional logging, breakpoints, or perf analysis when I need it.

Maybe something like:

```js

let input = readline();
let problem = step("Parsing", () => ({input}), async () => {
  // do parsing logic
})

let startState = { problem: problem, step: 1, next: []};
let solution = step("Solving", () => ({startState}), async () => {
  let state = startState;
  let done = false;

  while (!done) {
    step("Iteration", () => {state})
  }
})

```

And then a set of runtime commands like:

step.enableLogs("Iteration"); // logs the state 
step.enableTrace("Iteration"); // Calculates and logs the times for each round
step.enableDebug("Iteration", (state) => state.next.length > 5); // Debug next time you run and pass the criterion

*/

import { avg, max, min } from ".";

let shouldLog: Map<string, boolean> = new Map();
let shouldTime: Map<string, number[]> = new Map();
let shouldDebug: Map<string, (state: {}) => boolean> = new Map();

function step<A>(name: string, state: () => {}, cb: () => A): A {
  if (shouldLog.get(name)) console.log(name, state());
  let debug = shouldDebug.get(name)?.(state());
  let trace = shouldTime.get(name);

  if (debug) debugger;

  let start = performance.now();
  let result = cb();

  if (trace) trace.push(performance.now() - start);
  return result;
}

let showTimes = () =>
  shouldTime.forEach((times, name) => {
    console.log(
      `[PERF] ${name} called ${times.length} times: average ${avg(
        times
      ).toFixed(4)}ms (${min(times).toFixed(4)}ms - ${max(times).toFixed(4)}ms)`
    );
  });

shouldLog.set("Parse", true);
// shouldLog.set("Iteration", true);
shouldTime.set("Iteration", []);
shouldDebug.set("Iteration", () => true);

// Example usage

let input = [];
while (input.length < 10000) {
  input.push(Math.random() * 100000);
}
input = input.join(", ");

let problem = step(
  "Parse",
  () => ({ input }),
  () => {
    return input.split(", ").map((x) => parseInt(x, 10));
  }
);

let state = { sum: 0, remaining: problem };
while (state.remaining.length > 0) {
  step(
    "Iteration",
    () => state,
    () => {
      let [item, ...items] = state.remaining;
      state = {
        sum: state.sum + item,
        remaining: items,
      };
    }
  );
}

console.log(state.sum);
showTimes();
