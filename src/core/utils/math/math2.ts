export class Math2 {
  private constructor() { }

  public static min(a: number, b: number): number {
    return a < b ? a : b;
  }

  public static max(a: number, b: number): number {
    return a > b ? a : b;
  }

  public static abs(x: number): number {
    return x > 0 ? x : -x;
  }

  public static clamp(x: number, min: number, max: number): number {
    if (x < min) {
      return min;
    }

    if (x > max) {
      return max;
    }

    return x;
  }
}
