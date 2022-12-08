import { ScaledPointSet } from "./scaled-point-set";
import { SumSet } from "./sum-set";
import { SummationSet } from "./summation-set";

export class Wrap {
  private scaledPointSet: ScaledPointSet;
  private sumSet: SumSet;
  private summationSet: SummationSet;

  constructor(scaledPointSet: ScaledPointSet, sumSet: SumSet, summationSet: SummationSet) {
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
