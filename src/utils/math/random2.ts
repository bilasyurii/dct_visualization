const INT_32_MAX = 4294967296;

export class Random2 {
  public static instance: Random2 = new Random2();

  private seed: number;

  constructor(seed: number = Random2.makeSeed()) {
    this.seed = seed;
  }

  public setSeed(seed: number): void {
    this.seed = seed;
  }

  public getSeed(): number {
    return this.seed;
  }

  public int(): number {
    let t = this.seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return (t ^ t >>> 14) >>> 0;
  }

  public intBetween(min: number, max: number): number {
    return min + this.int() % (max - min);
  }

  public float(): number {
    return this.int() / INT_32_MAX;
  }

  public floatBetween(min: number, max: number): number {
    return min + (max - min) * this.float();
  }

  public boolean(): boolean {
    return ((this.int() & 1) === 1);
  }

  public static makeSeed(): number {
    return ~~(Math.random() * 0x7fffffff);
  }
}
