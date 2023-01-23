import { SignType } from "../../lexic/structures/sign-type.enum";
import { SummationOperandSet } from "../../lexic/structures/summation-operand-set";
import { SummationSet } from "../../lexic/structures/summation-set";
import { SuperWrap } from "../../lexic/structures/super-wrap";
import { Wrap } from "../../lexic/structures/wrap";
import { ArrayUtils } from "../../utils/array-utils";
import { Math2 } from "../../utils/math/math2";
import { ObjectUtils } from "../../utils/object-utils";

interface ISameSignOperands {
  signType: SignType;
  operands: number[];
  operandsCount: number;
  summationSet: SummationSet;
  summationOperandSets: SummationOperandSet[];
  allSummationOperandSets: SummationOperandSet[];
}

interface IIntersectionData {
  intersection: number[];
  groupA: ISameSignOperands;
  groupB: ISameSignOperands;
}

export class SuperWrapsOptimizer {
  private superWraps: SuperWrap[];

  public optimize(superWraps: SuperWrap[]): void {
    this.superWraps = superWraps;

    this.removeShortSuperWraps();
    this.mergeRedundantInputs();
    this.decreaseInputsCount();

    if (Math.random() < 0) {
      this.optimizeIntersections();
    }

    this.superWraps = null;
  }

  private removeShortSuperWraps(): void {
    const superWraps = this.superWraps;

    for (let i = superWraps.length - 1; i >= 0; --i) {
      if (superWraps[i].isShortVersion()) {
        superWraps.splice(i, 1);
      }
    }
  }

  private mergeRedundantInputs(): void {
    this.getAllWraps().forEach((wrap) => {
      const sumSet = wrap.getSumSet();
      const signedNumbers = sumSet.getSignedNumbers();

      if (signedNumbers.length === 1) {
        const summationSet = wrap.getSummationSet();
        const summationOperandSets = summationSet.getSummationOperandSets();
        const firstSet = summationOperandSets[0];
        const signType = firstSet.getSignType();
        const canBeMerged = summationOperandSets.every((set) => {
          return (
            set.getSignType() === signType &&
            set.getSummationOperands().length === 1
          );
        });

        if (canBeMerged) {
          const summationOperandSet = new SummationOperandSet(signType);
          summationOperandSets.forEach((set) => {
            const operand = set.getSummationOperands()[0].clone();
            summationOperandSet.addSummationOperand(operand);
          });

          summationSet.makeEmpty();
          summationSet.addSummationOperandSet(summationOperandSet);
        }
      }
    });
  }

  private decreaseInputsCount(): void {
    this.getAllWraps().forEach((wrap) => {
      const summationSet = wrap.getSummationSet();
      const summationOperandSets = summationSet.getSummationOperandSets();
      const canBeSimplified = summationOperandSets.length > 2;

      if (canBeSimplified) {
        const firstSet = new SummationOperandSet(summationOperandSets[0].getSignType());
        const secondSet = new SummationOperandSet(summationOperandSets[1].getSignType());

        let addToFirst = true;

        summationOperandSets.forEach((set) => {
          if (addToFirst) {
            firstSet.addManyFrom(set);
          } else {
            secondSet.addManyFrom(set);
          }

          addToFirst = !addToFirst;
        });

        summationSet.makeEmpty();
        summationSet.addSummationOperandSet(firstSet);
        summationSet.addSummationOperandSet(secondSet);
      }
    });
  }

  private getAllWraps(): Wrap[] {
    return this.superWraps.map((superWrap) => superWrap.getWraps()).flat();
  }

  // TODO
  private optimizeIntersections(): void {
    const wraps = this.superWraps.map((superWrap) => superWrap.getWraps()).flat();
    const summationSets = wraps.map((wrap) => wrap.getSummationSet()).flat();
    const sameSignGroups = summationSets.map((summationSet) => this.groupBySameSign(summationSet)).flat();
    const intersectionsCount = this.calculateIntersectionsCount(sameSignGroups.length);
    this.sortSameSignGroups(sameSignGroups);
    const intersections = this.findIntersections(sameSignGroups, intersectionsCount);
    console.log(intersections);
  }

  private groupBySameSign(summationSet: SummationSet): ISameSignOperands[] {
    const allSummationOperandSets = summationSet.getSummationOperandSets();
    const groupedBySign = ArrayUtils.groupBy(allSummationOperandSets, (summationOperandSet) => summationOperandSet.getSignType());

    return ObjectUtils.mapObjectToArray<SignType, SummationOperandSet[], ISameSignOperands>(groupedBySign, (signType, summationOperandSets) => {
      const operands = summationOperandSets.map((summationOperandSet) => {
        const summationOperands = summationOperandSet.getSummationOperands();
        return summationOperands.map((operand) => operand.getValue());
      }).flat();

      return {
        signType,
        summationSet,
        summationOperandSets,
        allSummationOperandSets,
        operands,
        operandsCount: operands.length,
      };
    });
  }

  private calculateIntersectionsCount(itemsCount: number): number {
    const pairsCount = ~~((itemsCount * itemsCount) * 0.5);
    const maxIntersections = 100;
    return Math2.min(pairsCount, maxIntersections);
  }

  private sortSameSignGroups(groups: ISameSignOperands[]): void {
    groups.sort((a, b) => b.operandsCount - a.operandsCount);
  }

  private findIntersections(groups: ISameSignOperands[], maxIntersectionsCount: number): IIntersectionData[] {
    const groupsCount = groups.length;
    const intersections: IIntersectionData[] = [];
    const intersectionSizes: number[] = [];

    let detectedCount = 0;
    let maximumReached = false;
    let minimalIntersectionSize = 2;

    for (let i = 1; i < groupsCount; ++i) {
      const groupA = groups[i];
      const lengthA = groupA.operandsCount;

      if (lengthA < minimalIntersectionSize) {
        break;
      }

      for (let j = 0; j < i; ++j) {
        const groupB = groups[j];
        const lengthB = groupB.operandsCount;

        if (lengthB < minimalIntersectionSize) {
          break;
        }

        const intersectionData = this.calculateIntersectionData(groupA, groupB);

        if (intersectionData) {
          const intersectionSize = intersectionData.intersection.length;
          const insertionIndex = ArrayUtils.sortedInsertIndexDesc(intersectionSizes, intersectionSize);

          if (maximumReached && insertionIndex >= detectedCount) {
            continue;
          }

          intersections.splice(insertionIndex, 0, intersectionData);
          intersectionSizes.splice(insertionIndex, 0, intersectionSize);

          if (maximumReached) {
            intersections.pop();
            intersectionSizes.pop();
            minimalIntersectionSize = intersectionSizes[detectedCount - 1];
          } else {
            ++detectedCount;

            if (detectedCount === maxIntersectionsCount) {
              maximumReached = true;
              minimalIntersectionSize = intersectionSizes[detectedCount - 1];
            }
          }
        }
      }
    }

    return intersections;
  }

  private calculateIntersectionData(groupA: ISameSignOperands, groupB: ISameSignOperands): IIntersectionData {
    const operandsA = groupA.operands;
    const operandsB = groupB.operands;
    const lengthA = operandsA.length;
    const lengthB = operandsB.length;
    const maxLength = Math2.max(lengthA, lengthB);
    const minimalIntersection = Math2.max(2, ~~(maxLength * 0.5));
    const maxPossibleIntersection = Math2.min(lengthA, lengthB);

    if (maxPossibleIntersection < minimalIntersection) {
      return null;
    }

    const intersection = ArrayUtils.intersection(operandsA, operandsB);
    const intersectionSize = intersection.length;

    if (intersectionSize < minimalIntersection) {
      return null;
    }

    return {
      intersection,
      groupA,
      groupB,
    };
  }
}
