import { Math2 } from "./math2";
import { IVector } from "./vector.interface";

export class VectorUtils {
  private constructor() { }

  public static distance(a: IVector, b: IVector): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  public static distanceManhattan(a: IVector, b: IVector): number {
    return Math2.abs(a.x - b.x) + Math2.abs(a.y - b.y);
  }

  public static distanceChebyshev(a: IVector, b: IVector): number {
    return Math.max(Math2.abs(a.x - b.x), Math2.abs(a.y - b.y));
  }

  public static clone(vec: IVector): IVector {
    return {
      x: vec.x,
      y: vec.y,
    };
  }

  public static add(a: IVector, b: IVector): IVector {
    return {
      x: a.x + b.x,
      y: a.y + b.y,
    };
  }

  public static subtract(a: IVector, b: IVector): IVector {
    return {
      x: a.x - b.x,
      y: a.y - b.y,
    };
  }

  public static perpendicular(a: IVector): IVector {
    return {
      x: -a.y,
      y: a.x,
    };
  }

  public static inverted(a: IVector): IVector {
    return {
      x: -a.x,
      y: -a.y,
    };
  }
}
