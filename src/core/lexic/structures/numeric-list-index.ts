import { BaseLexicalStructure } from "./base-lexical-structure";
import { StructureType } from "./structure-type.enum";

export class NumericListIndex extends BaseLexicalStructure {
  private value: number;

  constructor(value: number) {
    super(StructureType.NumericListIndex);

    this.value = value;
  }

  public getValue(): number {
    return this.value;
  }
}
