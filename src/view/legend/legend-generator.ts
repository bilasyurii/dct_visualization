import { SummationOperand } from "../../core/lexic/structures/summation-operand";
import { SummationOperandSet } from "../../core/lexic/structures/summation-operand-set";
import { SuperWrap } from "../../core/lexic/structures/super-wrap";
import { StringUtils } from "../../core/utils/string-utils";

export class LegendGenerator {
  private result: string;

  public generate(superWraps: SuperWrap[]): string {
    this.result = "";

    superWraps.forEach((superWrap) => {
      const wraps = superWrap.getWraps();

      wraps.forEach((wrap) => {
        const summationSet = wrap.getSummationSet();
        const summationOperandSets = summationSet.getSummationOperandSets();

        summationOperandSets.forEach((summationOperandSet, i) => {
          const xExpression = this.generateXExpression(i + 1, superWrap.getKey(), wrap.getKey());
          const summationOperandsSetExpression = this.mapSummationOperandSet(summationOperandSet);
          this.result += `${xExpression}=${summationOperandsSetExpression}<br>`;
        });
      });
    });

    return this.result;
  }

  private mapSummationOperandSet(summationOperandSet: SummationOperandSet): string {
    const sign = summationOperandSet.getSignString();
    const summationOperands = summationOperandSet.getSummationOperands();

    if (summationOperands.length === 1) {
      return `${sign}${this.mapSummationOperand(summationOperands[0])}`;
    } else {
      return `${sign}(${summationOperands.map((summationOperand) => this.mapSummationOperand(summationOperand)).join(", ")})`;
    }
  }

  private mapSummationOperand(summationOperand: SummationOperand): string {
    return `x(${summationOperand.getValue()})`;
  }

  private generateXExpression(index: number, numericIndex: string, alphabeticIndex: string) {
    return `x${StringUtils.multiply("'", index)}<sub>${numericIndex}${alphabeticIndex}</sub>`;
  }
}
