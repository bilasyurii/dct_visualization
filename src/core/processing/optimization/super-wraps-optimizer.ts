import { SignType } from "../../lexic/structures/sign-type.enum";
import { SummationOperandSet } from "../../lexic/structures/summation-operand-set";
import { SummationSet } from "../../lexic/structures/summation-set";
import { SuperWrap } from "../../lexic/structures/super-wrap";
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
  public optimize(superWraps: SuperWrap[]): void {
    const filtered = superWraps.filter((superWrap) => !superWrap.isShortVersion());
    const wraps = filtered.map((superWrap) => superWrap.getWraps()).flat();
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
