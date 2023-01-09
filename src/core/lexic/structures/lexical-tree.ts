import { SuperWrap } from "./super-wrap";

export class LexicalTree {
  private superWraps: SuperWrap[];

  constructor() {
    this.superWraps = [];
  }

  public getSuperWraps(): SuperWrap[] {
    return this.superWraps.slice();
  }

  public addSuperWrap(superWrap: SuperWrap): void {
    this.superWraps.push(superWrap);
  }
}
