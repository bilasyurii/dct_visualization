import { BaseLexicalStructure } from "./base-lexical-structure";
import { ScaledPointSet } from "./scaled-point-set";
import { StructureType } from "./structure-type.enum";
import { SumSet } from "./sum-set";
import { SummationSet } from "./summation-set";

export class Wrap extends BaseLexicalStructure {
  private scaledPointSet: ScaledPointSet;
  private sumSet: SumSet;
  private summationSet: SummationSet;

  constructor(scaledPointSet: ScaledPointSet, sumSet: SumSet, summationSet: SummationSet) {
    super(StructureType.Wrap);

    this.scaledPointSet = scaledPointSet;
    this.sumSet = sumSet;
    this.summationSet = summationSet;
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
}
