import { BaseLexicalStructure } from "./base-lexical-structure";
import { StructureType } from "./structure-type.enum";

export class Point extends BaseLexicalStructure {
  private x: number;
  private y: number;

  constructor(x: number, y: number) {
    super(StructureType.Point);

    this.x = x;
    this.y = y;
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }
}
