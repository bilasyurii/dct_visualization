import { BaseLexicalStructure } from "./base-lexical-structure";
import { SignType } from "./sign-type.enum";
import { StructureType } from "./structure-type.enum";
import { SummationOperand } from "./summation-operand";

export class SummationOperandSet extends BaseLexicalStructure {
  private signType: SignType;
  private summationOperands: SummationOperand[];

  constructor(signType: SignType) {
    super(StructureType.SummationOperandSet);

    this.signType = signType;
    this.summationOperands = [];
  }

  public getSignType(): SignType {
    return this.signType;
  }

  public getSummationOperands(): SummationOperand[] {
    return this.summationOperands.slice();
  }

  public addSignedNumber(summationOperand: SummationOperand): void {
    this.summationOperands.push(summationOperand);
  }
}
