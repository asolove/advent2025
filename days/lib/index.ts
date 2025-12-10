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

export function unique<A>(arr: A[]): A[] {
  return [...new Set(arr)];
}

export class UnionFind {
  parents: number[];
  size: number;
  constructor(size: number) {
    this.size = size;
    let parents = [];
    for (let i = 0; i < size; i++) {
      parents[i] = i;
    }
    this.parents = parents;
  }

  union(a: number, b: number) {
    let bRoot = this.find(b);

    // TODO: set parents all along the way finding A's parent
    let aRoot = this.find(a);

    this.parents[a] = bRoot;
    this.parents[aRoot] = bRoot;
  }

  find(n: number) {
    let parent = this.parents[n];
    if (parent === n) return n;
    return this.find(parent);
  }
}

export class PriorityQueue<A> {
  items: [number, A][];
  size: number;

  constructor() {
    this.items = [];
    this.size = 0;
  }

  pop(): A {
    let topItem = this.items[0];
    if (!topItem) throw new Error("Empty heap");

    let newTopItem = this.items[this.size - 1];
    this.items[0] = newTopItem;
    delete this.items[this.size - 1];
    this.size--;

    // rotate
    this.rotateDown(0);

    return topItem[1];
  }

  push(item: A, priority: number) {
    this.items[this.size] = [priority, item];
    this.size++;
    this.rotateUp(this.size - 1);

    return;
  }

  rotateDown(index: number) {
    let parent = this.items[index];
    let child1Index = index * 2;
    let child2Index = index * 2 + 1;
    let child1 = this.items[child1Index];
    let child2 = this.items[child2Index];
    if (!child1) return;
    if (!child2) return this.rotateUp(child1Index);

    let min = Math.min(parent[0], child1[0], child2[0]);
    if (min === parent[0]) {
      return;
    } else if (min === child1[0]) {
      this.items[index] = child1;
      this.items[child1Index] = parent;
      this.rotateDown(child1Index);
    } else {
      this.items[index] = child2;
      this.items[child2Index] = parent;
      this.rotateDown(child2Index);
    }
  }
  rotateUp(index: number) {
    if (index === 0) return;

    let child = this.items[index];
    let parentIndex = Math.floor(index / 2);
    let parent = this.items[parentIndex];

    if (parent[0] < child[0]) return;

    this.items[index] = parent;
    this.items[parentIndex] = child;
    this.rotateUp(parentIndex);
  }
}

export const toBits = (bools: boolean[]): number =>
  bools.reduce(
    (total, bool, index) => total + (!bool ? 0 : Math.pow(2, index)),
    0
  );

export const fromBits = (n: number, len: number): boolean[] => {
  let r = Array(len).fill(false);
  for (let i = 0; i < len; i++) {
    r[i] = n % 2 === 1;
    n >>= 1;
  }
  return r;
};
