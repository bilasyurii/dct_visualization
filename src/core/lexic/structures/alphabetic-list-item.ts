import { BaseLexicalStructure } from "./base-lexical-structure";
import { StructureType } from "./structure-type.enum";

export class AlphabeticListItem<T> extends BaseLexicalStructure {
  private key: string;
  private value: T;

  constructor(key: string, value: T) {
    super(StructureType.AlphabeticListItem);

    this.key = key;
    this.value = value;
  }

  public getKey(): string {
    return this.key;
  }

  public getValue(): T {
    return this.value;
  }
}
