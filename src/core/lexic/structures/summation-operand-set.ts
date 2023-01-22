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

  public getSignMultiplier(): number {
    const signType = this.signType;
    switch (signType) {
      case SignType.Negative:
        return -1;
      case SignType.Positive:
      case SignType.None:
        return 1;
    }
  }

  public getSignString(): string {
    const signType = this.signType;
    switch (signType) {
      case SignType.Negative:
        return "-";
      case SignType.Positive:
        return "+";
      case SignType.None:
        return "";
    }
  }

  public isPositive(): boolean {
    return this.signType === SignType.Positive;
  }

  public isNegative(): boolean {
    return this.signType === SignType.Negative;
  }

  public getSummationOperands(): SummationOperand[] {
    return this.summationOperands.slice();
  }

  public addSummationOperand(summationOperand: SummationOperand): void {
    this.summationOperands.push(summationOperand);
  }

  public addManyFrom(summationOperandSet: SummationOperandSet): void {
    const operands = summationOperandSet.getSummationOperands();
    operands.forEach((operand) => this.addSummationOperand(operand.clone()));
  }
}
