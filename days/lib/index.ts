export let input = async function () {
  let r: string = "";
  for await (const chunk of Bun.stdin.stream()) {
    r += Buffer.from(chunk).toString();
  }
  return r;
};

export let inputLines = async function () {
  return (await input()).split("\n");
};

// Helpers

export let sum = (a: number, b: number) => a + b;
export let product = (a: number, b: number) => a * b;

export let min2 = (a: number, b: number) => Math.min(a, b);
export let max2 = (a: number, b: number) => Math.max(a, b);
export let min = (ns: number[]) => ns.reduce(min2);
export let max = (ns: number[]) => ns.reduce(max2);
export let avg = (ns: number[]) => ns.reduce(sum, 0) / ns.length;

export let isDigit = (c: string) => c >= "0" && c <= "9";

export let merge = <A>(a: Array<A>, b: Array<A>) => ({ ...a, ...b });

export function isPresent<A>(a: A | undefined): a is A {
  return a !== undefined;
}

export function tap<A>(name: string, value: A): A {
  console.log(name, value);
  return value;
}

export function counts<A>(items: A[]): Map<A, number> {
  let r = new Map();
  for (let item of items) {
    if (r.has(item)) {
      r.set(item, r.get(item) + 1);
    } else {
      r.set(item, 1);
    }
  }
  return r;
}

export function pairs<A>(items: A[]): [A, A][] {
  let r: [A, A][] = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j != i && j < items.length; j++) {
      r.push([items[i], items[j]]);
    }
  }
  return r;
}

export function transpose<A>(items: A[][]): A[][] {
  let r: A[][] = [];
  for (let j = 0; j < items[0].length; j++) {
    r[j] = [];
    for (let i = 0; i < items.length; i++) {
      r[j][i] = items[i][j];
    }
  }

  return r;
}

export function minBy<A>(
  items: IterableIterator<A>,
  key: (i: A) => number
): A | undefined {
  let minItem: A | undefined = undefined;
  let minValue: number | undefined = undefined;
  for (let item of items) {
    let value = key(item);
    if (minValue === undefined || value < minValue) {
      minItem = item;
      minValue = value;
    }
  }
  return minItem;
}

export function union<A>(s1: Set<A>, s2: Set<A>): Set<A> {
  return new Set([...s1, ...s2]);
}

export function isSubset<A>(s1: Set<A>, s2: Set<A>): boolean {
  return [...s1.values()].every((i) => s2.has(i));
}
