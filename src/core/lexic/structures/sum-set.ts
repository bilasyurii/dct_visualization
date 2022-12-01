import { BaseLexicalStructure } from "./base-lexical-structure";
import { SignedNumber } from "./signed-number";
import { StructureType } from "./structure-type.enum";

export class SumSet extends BaseLexicalStructure {
  private signedNumbers: SignedNumber[];

  constructor() {
    super(StructureType.SumSet);

    this.signedNumbers = [];
  }

  public getSignedNumbers(): SignedNumber[] {
    return this.signedNumbers.slice();
  }

  public addSignedNumber(signedNumber: SignedNumber): void {
    this.signedNumbers.push(signedNumber);
  }
}
