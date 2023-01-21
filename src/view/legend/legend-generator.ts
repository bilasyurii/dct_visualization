import { SummationOperand } from "../../core/lexic/structures/summation-operand";
import { SummationOperandSet } from "../../core/lexic/structures/summation-operand-set";
import { SummationSet } from "../../core/lexic/structures/summation-set";
import { Wrap } from "../../core/lexic/structures/wrap";
import { SuperWrap } from "../../core/lexic/structures/super-wrap";
import { StringUtils } from "../../core/utils/string-utils";
import { SignType } from "../../core/lexic/structures/sign-type.enum";
import { ArrayUtils } from "../../core/utils/array-utils";

interface ISummationOperandSetData {
  summationOperandSet: SummationOperandSet;
  index: number;
  signType: SignType;
  operandsRaw: number[];
  summationSet: SummationSet;
  wrap: Wrap;
  superWrap: SuperWrap;
}

interface ISameOperandsSet {
  items: ISummationOperandSetData[];
}

export class LegendGenerator {
  public generate(superWraps: SuperWrap[]): string {
    let result = "";

    const data = this.getSummationOperandSetsData(superWraps);
    const sameOperandsSets = this.getSameOperandsSets(data);

    sameOperandsSets.forEach((set) => {
      const items = set.items;
      const xExpressions = items.map((item) => this.generateXExpression(
        item.index + 1,
        item.superWrap.getKey(),
        item.wrap.getKey()
      )).join("=");

      const firstItem = items[0];
      const summationOperandsSetExpression = this.mapSummationOperandSet(firstItem.summationOperandSet);

      result += `${xExpressions}=${summationOperandsSetExpression}<br>`;
    });

    return result;
  }

  private mapSummationOperandSet(summationOperandSet: SummationOperandSet): string {
    const summationOperands = summationOperandSet.getSummationOperands();

    if (summationOperands.length === 1) {
      return `${this.mapSummationOperand(summationOperands[0])}`;
    } else {
      return `(${summationOperands.map((summationOperand) => this.mapSummationOperand(summationOperand)).join(", ")})`;
    }
  }

  private getSummationOperandSetsData(superWraps: SuperWrap[]): ISummationOperandSetData[] {
    const data: ISummationOperandSetData[] = [];

    superWraps.forEach((superWrap) => {
      const wraps = superWrap.getWraps();

      wraps.forEach((wrap) => {
        const summationSet = wrap.getSummationSet();
        const summationOperandSets = summationSet.getSummationOperandSets();

        summationOperandSets.forEach((summationOperandSet, index) => {
          const signType = summationOperandSet.getSignType();
          const operandsRaw = summationOperandSet
            .getSummationOperands()
            .map((operand) => operand.getValue());

          data.push({
            summationOperandSet,
            index,
            signType,
            operandsRaw,
            summationSet,
            wrap,
            superWrap,
          });
        });
      });
    });

    return data;
  }

  private getSameOperandsSets(data: ISummationOperandSetData[]): ISameOperandsSet[] {
    const sets: ISameOperandsSet[] = [];

    for (let i = 0; i < data.length; ++i) {
      const item = data[i];
      const { operandsRaw, signType } = item;

      const items: ISummationOperandSetData[] = [];

      for (let j = data.length - 1; j > i; --j) {
        const otherItem = data[j];

        if (otherItem.signType === signType && ArrayUtils.equals(operandsRaw, otherItem.operandsRaw)) {
          items.push(otherItem);
          data.splice(j, 1);
        }
      }

      items.push(item);

      if (items.length > 1) {
        items.reverse();
      }

      sets.push({
        items,
      });
    }

    return sets;
  }

  private mapSummationOperand(summationOperand: SummationOperand): string {
    return `x(${summationOperand.getValue()})`;
  }

  private generateXExpression(index: number, numericIndex: string, alphabeticIndex: string) {
    return `x${StringUtils.multiply("'", index)}<sub>${numericIndex}${alphabeticIndex}</sub>`;
  }
}
