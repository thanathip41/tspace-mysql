import { performance } from "perf_hooks";
import { Model } from "../src/lib";

const pattern: "snake_case" | "camelCase" = "camelCase";

class User extends Model {
  constructor() {
    super();
    this.usePattern(pattern);
    this.useUUID();
    this.useTimestamp();
    this.useSoftDelete();
    this.hasMany({ model: Post, name: "posts" });
    this.hasOne({ model: Post, name: "post" });
  }
}

class Post extends Model {
  constructor() {
    super();
    this.usePattern(pattern);
    this.useUUID();
    this.useTimestamp();
    this.useSoftDelete();
    this.belongsTo({ name: "user", model: User });
  }
}

async function benchmark<T>(
  func: (...args: any[]) => Promise<T>,
  ...args: any[]
): Promise<number> {
  const start = performance.now();
  await func(...args);
  const end = performance.now();
  return end - start;
}

async function averageBenchmark<T>(
  func: (...args: any[]) => Promise<T>,
  runs: number,
  ...args: any[]
): Promise<number> {
  const benchmarks: any[] = [];
  for (let i = 0; i < runs; i++) {
    benchmarks.push(() => benchmark(func, ...args));
  }
  const results = await Promise.all(benchmarks.map((v) => v()));
  const total = results.reduce((acc, time) => acc + time, 0);
  return total / runs;
}

async function run(): Promise<any[]> {
  const results: any[] = await new User().with("posts").limit(10_000).get();
  return results;
}

(async () => {
  const avgTime = await averageBenchmark(run, 10);
  console.log(`Average execution time : ${avgTime.toFixed(0)} ms`);
})();
