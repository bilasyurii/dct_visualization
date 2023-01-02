import { BaseLexicalStructure } from "./base-lexical-structure";
import { StructureType } from "./structure-type.enum";

export class AlphabeticListIndex extends BaseLexicalStructure {
  private value: string;

  constructor(value: string) {
    super(StructureType.AlphabeticListIndex);

    this.value = value;
  }

  public getValue(): string {
    return this.value;
  }
}
