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

let shouldLog: Map<string, boolean> = new Map();
let shouldTrace: Map<string, boolean> = new Map();
let shouldDebug: Map<string, (state: {}) => boolean> = new Map();

function step<A>(name: string, state: () => {}, cb: () => A): A {
  if (shouldLog.get(name)) console.log(name, state());
  let debug = shouldDebug.get(name)?.(state());

  if (debug) debugger;
  let result = cb();
  return result;
}
