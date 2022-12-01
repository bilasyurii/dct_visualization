import { BaseLexicalStructure } from "./base-lexical-structure";
import { StructureType } from "./structure-type.enum";
import { SummationOperandSet } from "./summation-operand-set";

export class SummationSet extends BaseLexicalStructure {
  private summationOperandSets: SummationOperandSet[];

  constructor() {
    super(StructureType.SummationSet);

    this.summationOperandSets = [];
  }

  public getSummationOperandSets(): SummationOperandSet[] {
    return this.summationOperandSets.slice();
  }

  public addSummationOperandSet(summationOperandSet: SummationOperandSet): void {
    this.summationOperandSets.push(summationOperandSet);
  }
}
