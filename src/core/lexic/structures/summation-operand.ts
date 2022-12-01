import { BaseLexicalStructure } from "./base-lexical-structure";
import { StructureType } from "./structure-type.enum";

export class SummationOperand extends BaseLexicalStructure {
  private value: number;

  constructor(value: number) {
    super(StructureType.SummationOperand);

    this.value = value;
  }

  public getValue(): number {
    return this.value;
  }
}
