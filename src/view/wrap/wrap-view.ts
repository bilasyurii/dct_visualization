import { ViewConfig } from "../../config/view-config";
import { SignType } from "../../core/lexic/structures/sign-type.enum";
import { Wrap } from "../../core/lexic/structures/wrap";
import { Math2 } from "../../core/utils/math/math2";
import { Arrow } from "./visual-elements/arrow";
import { CrossedArrow } from "./visual-elements/crossed-arrow";
import { IndexedTextView } from "./visual-elements/indexed-text-view";
import { RectangleWithTextView } from "./visual-elements/rectangle-with-text-view";
import { IWrapViewConfig } from "./wrap-view-config.interface";

export class WrapView extends Phaser.GameObjects.Container {
  private wrap: Wrap;
  private config: IWrapViewConfig;
  private nCount: number;
  private xCount: number;
  private pointsCount: number;

  constructor(scene: Scene, wrap: Wrap, config: IWrapViewConfig) {
    super(scene);

    this.wrap = wrap;
    this.config = config;

    this.calculateParameters();
    this.initRectangles();
    this.initArrows();
  }

  private calculateParameters(): void {
    const wrap = this.wrap;
    const summationSet = wrap.getSummationSet();
    const summationOperandSets = summationSet.getSummationOperandSets();

    this.nCount = summationOperandSets.reduce(
      (sum, summationOperandSet) =>
        sum + summationOperandSet.getSummationOperands().length,
      0
    );

    this.pointsCount = wrap
      .getSummationSet()
      .getSummationOperandSets()[0]
      .getSummationOperands().length;

    this.xCount = this.nCount / this.pointsCount;
  }

  private initRectangles(): void {
    this.initURectangle();
    this.initPRectangle();
  }

  private initArrows(): void {
    this.initSumArrow();
    this.initUInputArrows();
    this.initUtoPArrow();
    this.initPOutputArrow();
  }

  private initURectangle(): void {
    const width = 50;
    const xCount = Math2.min(this.xCount, ViewConfig.xInputs.maxCount);
    const height = ViewConfig.xInputs.interval * (xCount + 1);
    const text = "U";
    const uRectangle = new RectangleWithTextView(
      this.scene,
      text,
      width,
      height
    );
    this.add(uRectangle);
    uRectangle.setPosition(200, 80);
  }

  private initPRectangle(): void {
    const width = 70;
    const height = 55;
    const text = `CC\n${this.pointsCount}p`;
    const pRectangle = new RectangleWithTextView(
      this.scene,
      text,
      width,
      height
    );
    this.add(pRectangle);
    pRectangle.setPosition(300, 50);
  }

  private initSumArrow(): void {
    this.initArrow(100, 60, 300, 60);
    this.add(new IndexedTextView(this.scene, this.formatSum(), "").setAnchorX(0.5).setPosition(100, 30));
  }

  private initUInputArrows(): void {
    const count = this.xCount;
    const maxCount = ViewConfig.xInputs.maxCount;

    const hasSkip = (count > maxCount);
    let skipFrom = Infinity;
    let skipTo = -Infinity;

    if (hasSkip) {
      skipFrom = this.getSkipFrom(count, maxCount);
      skipTo = this.getSkipTo(count, maxCount);
    }

    let epsilonAdded = false;
    let arrowSlotIndex = 0;

    for (let i = 0; i < count; ++i) {
      const y = 80 + ViewConfig.xInputs.interval * (arrowSlotIndex + 1);

      if (i >= skipFrom && i < skipTo) {
        // skip
        if (!epsilonAdded) {
          this.initEpsilon(y);
          ++arrowSlotIndex;
          epsilonAdded = true;
        }
      } else {
        this.initXArrow(i + 1, y);
        ++arrowSlotIndex;
      }
    }
  }

  private initUtoPArrow(): void {
    this.initArrow(250, 90, 300, 90, true);
    this.add(new IndexedTextView(this.scene, "", this.pointsCount + "").setPosition(260, 65));
  }

  private initPOutputArrow(): void {
    this.initArrow(370, 75, 430, 75, true);
    this.add(new IndexedTextView(this.scene, "X", this.config.xOutputValue + "").setAnchorX(0.5).setPosition(430, 40));
    this.add(new IndexedTextView(this.scene, this.pointsCount + "", "").setPosition(380, 40));
  }

  private initArrow(fromX: number, fromY: number, toX: number, toY: number, crossed: boolean = false): void {
    const arrow = crossed ? new CrossedArrow(this.scene) : new Arrow(this.scene);
    arrow.setDimensions(toX - fromX, toY - fromY);
    arrow.setPosition(fromX, fromY);
    this.add(arrow);
  }

  private initEpsilon(y: number): void {
    this.add(new IndexedTextView(this.scene, "...", "").setAnchorX(0.5).setPosition(150, y - 15));
  }

  private initXArrow(index: number, y: number): void {
    this.initArrow(100, y, 200, y);
    this.add(new IndexedTextView(this.scene, "x", this.formatXIndex(index)).setAnchorX(1).setPosition(100, y - 23));
  }

  private formatXIndex(index: number): string {
    return (this.config.xInputValueOffset + index) + "";
  }

  private formatSum(): string {
    const signedNumbers = this.wrap.getSumSet().getSignedNumbers();
    const count = signedNumbers.length;
    const maxCount = ViewConfig.sumSet.maxCount;

    const hasSkip = (count > maxCount);
    let skipFrom = Infinity;
    let skipTo = -Infinity;

    if (hasSkip) {
      skipFrom = this.getSkipFrom(count, maxCount);
      skipTo = this.getSkipTo(count, maxCount);
    }

    let epsilonAdded = false;
    let result = "";

    for (let i = 0; i < count; ++i) {
      if (i >= skipFrom && i < skipTo) {
        // skip
        if (!epsilonAdded) {
          result += "...,";
          epsilonAdded = true;
        }
      } else {
        const signedNumber = signedNumbers[i];
        result += `${this.getSignText(signedNumber.getSignType())}${signedNumber.getAbsoluteValue()},`;
      }
    }

    // removing last comma separator
    result = result.substring(0, result.length - 1);

    return `(${result})`;
  }

  private getSkipFrom(count: number, maxCount: number): number {
    return maxCount - 2;
  }

  private getSkipTo(count: number, maxCount: number): number {
    return count - 1;
  }

  private getSignText(signType: SignType): string {
    switch (signType) {
      case SignType.Negative:
        return "-";
      case SignType.Positive:
        return "+";
      case SignType.None:
        return "";
    }
  }
}
