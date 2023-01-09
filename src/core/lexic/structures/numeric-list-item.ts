import { BaseLexicalStructure } from "./base-lexical-structure";
import { StructureType } from "./structure-type.enum";

export class NumericListItem<T> extends BaseLexicalStructure {
  private key: number;
  private value: T;

  constructor(key: number, value: T) {
    super(StructureType.NumericListItem);

    this.key = key;
    this.value = value;
  }

  public getKey(): number {
    return this.key;
  }

  public getValue(): T {
    return this.value;
  }
}
