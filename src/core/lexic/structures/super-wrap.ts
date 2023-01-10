import { BaseLexicalStructure } from "./base-lexical-structure";
import { StructureType } from "./structure-type.enum";
import { Wrap } from "./wrap";

export class SuperWrap extends BaseLexicalStructure {
  private key: string;
  private wraps: Wrap[];

  constructor() {
    super(StructureType.SuperWrap);

    this.wraps = [];
  }

  public setKey(key: string): void {
    this.key = key;
  }

  public getKey(): string {
    return this.key;
  }

  public getWraps(): Wrap[] {
    return this.wraps.slice();
  }

  public addWrap(wrap: Wrap): void {
    this.wraps.push(wrap);
  }
}
