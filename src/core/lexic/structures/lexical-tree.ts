import { BaseLexicalStructure } from "./base-lexical-structure";
import { StructureType } from "./structure-type.enum";
import { SuperWrap } from "./super-wrap";

export class LexicalTree extends BaseLexicalStructure {
  private superWraps: SuperWrap[];

  constructor() {
    super(StructureType.LexicalTree);

    this.superWraps = [];
  }

  public getSuperWraps(): SuperWrap[] {
    return this.superWraps.slice();
  }

  public addSuperWrap(superWrap: SuperWrap): void {
    this.superWraps.push(superWrap);
  }
}
