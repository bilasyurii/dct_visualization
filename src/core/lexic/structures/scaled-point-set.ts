import { BaseLexicalStructure } from "./base-lexical-structure";
import { ScaledPoint } from "./scaled-point";
import { StructureType } from "./structure-type.enum";

export class ScaledPointSet extends BaseLexicalStructure {
  private scaledPoints: ScaledPoint[];

  constructor() {
    super(StructureType.ScaledPointSet);

    this.scaledPoints = [];
  }

  public getScaledPoints(): ScaledPoint[] {
    return this.scaledPoints.slice();
  }

  public addScaledPoint(scaledPoint: ScaledPoint): void {
    this.scaledPoints.push(scaledPoint);
  }
}
