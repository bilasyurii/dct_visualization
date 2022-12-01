import { BaseLexicalStructure } from "./base-lexical-structure";
import { Point } from "./point";
import { SignedNumber } from "./signed-number";
import { StructureType } from "./structure-type.enum";

export class ScaledPoint extends BaseLexicalStructure {
  private signedNumber: SignedNumber;
  private point: Point;

  constructor(signedNumber: SignedNumber, point: Point) {
    super(StructureType.ScaledPoint);

    this.signedNumber = signedNumber;
    this.point = point;
  }

  public getSignedNumber(): SignedNumber {
    return this.signedNumber;
  }

  public getPoint(): Point {
    return this.point;
  }
}
