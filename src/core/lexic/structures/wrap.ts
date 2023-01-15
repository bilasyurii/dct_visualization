import { BaseLexicalStructure } from "./base-lexical-structure";
import { ScaledPointSet } from "./scaled-point-set";
import { StructureType } from "./structure-type.enum";
import { SumSet } from "./sum-set";
import { SummationSet } from "./summation-set";

export class Wrap extends BaseLexicalStructure {
  private key: string;
  private scaledPointSet: ScaledPointSet;
  private sumSet: SumSet;
  private summationSet: SummationSet;

  constructor(scaledPointSet: ScaledPointSet, sumSet: SumSet, summationSet: SummationSet) {
    super(StructureType.Wrap);

    this.scaledPointSet = scaledPointSet;
    this.sumSet = sumSet;
    this.summationSet = summationSet;
  }

  public setKey(key: string): void {
    this.key = key;
  }

  public getKey(): string {
    return this.key;
  }

  public getScaledPointSet(): ScaledPointSet {
    return this.scaledPointSet;
  }

  public getSumSet(): SumSet {
    return this.sumSet;
  }

  public getSummationSet(): SummationSet {
    return this.summationSet;
  }

  public calculateNCount(): number {
    const summationSet = this.getSummationSet();
    const summationOperandSets = summationSet.getSummationOperandSets();

    return summationOperandSets.reduce(
      (sum, summationOperandSet) =>
        sum + summationOperandSet.getSummationOperands().length,
      0
    );
  }

  public calculatePointsCount(): number {
    return this
      .getSummationSet()
      .getSummationOperandSets()[0]
      .getSummationOperands().length;
  }

  public isShortVersion(): boolean {
    const signedNumbers = this.getSumSet().getSignedNumbers();
    return signedNumbers.length === 1 && signedNumbers[0].getAbsoluteValue() === 0;
  }
}
