import { StructureType } from "./structure-type.enum";

export class BaseLexicalStructure {
  private readonly type: StructureType;

  constructor(type: StructureType) {
    this.type = type;
  }

  public getType(): StructureType {
    return this.type;
  }
}
