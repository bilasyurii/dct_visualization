import { BaseLexicalStructure } from "./base-lexical-structure";
import { SignType } from "./sign-type.enum";
import { StructureType } from "./structure-type.enum";

export class SignedNumber extends BaseLexicalStructure {
  private signType: SignType;
  private absoluteValue: number;

  constructor(signType: SignType, absoluteValue: number) {
    super(StructureType.SignedNumber);

    this.signType = signType;
    this.absoluteValue = absoluteValue;
  }

  public isPositive(): boolean {
    return this.signType === SignType.Positive;
  }

  public isNegative(): boolean {
    return this.signType === SignType.Negative;
  }

  public getAbsoluteValue(): number {
    return this.absoluteValue;
  }
}
