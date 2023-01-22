import { ViewConfig } from "../../config/view-config";
import { SignType } from "../../core/lexic/structures/sign-type.enum";
import { Wrap } from "../../core/lexic/structures/wrap";
import { Math2 } from "../../core/utils/math/math2";
import { StringUtils } from "../../core/utils/string-utils";
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
  private uRectangle: RectangleWithTextView;
  private ccRectangle: RectangleWithTextView;
  private outputArrow: Arrow;
  private isShortenedVersion: boolean;
  private shouldSkipURectangle: boolean;

  constructor(scene: Scene, wrap: Wrap, config: IWrapViewConfig) {
    super(scene);

    this.wrap = wrap;
    this.config = config;

    this.calculateParameters();
    this.initRectangles();
    this.initArrows();
  }

  public getHeight(): number {
    if (this.isShortenedVersion) {
      return 50;
    } else {
      const rectangle = this.uRectangle || this.ccRectangle;
      return rectangle.y + rectangle.getRectangle().getHeight();
    }
  }

  public getOutputArrowY(): number {
    return this.outputArrow.y;
  }

  private calculateParameters(): void {
    const wrap = this.wrap;

    this.nCount = wrap.calculateNCount();
    this.pointsCount = wrap.calculatePointsCount();
    this.xCount = this.nCount / this.pointsCount;

    this.isShortenedVersion = wrap.isShortVersion();
    this.shouldSkipURectangle = this.xCount === 1;
  }

  private initRectangles(): void {
    if (!this.isShortenedVersion) {
      if (!this.shouldSkipURectangle) {
        this.initURectangle();
      }

      this.initCCRectangle();
    }
  }

  private initArrows(): void {
    if (this.isShortenedVersion) {
      this.initInputToOutputArrow();
    } else {
      this.initSumArrow();

      if (this.shouldSkipURectangle) {
        this.initCCInputArrow();
      } else {
        this.initUInputArrows();
        this.initUtoCCArrow();
      }

      this.initCCOutputArrow();
    }
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
    this.uRectangle = uRectangle;
    this.add(uRectangle);
    uRectangle.setPosition(200, 80);
  }

  private initCCRectangle(): void {
    const width = 70;
    const height = 55;
    const text = `CC\n${this.pointsCount}p`;
    const ccRectangle = new RectangleWithTextView(
      this.scene,
      text,
      width,
      height
    );
    this.ccRectangle = ccRectangle;
    this.add(ccRectangle);
    ccRectangle.setPosition(300, 50);
  }

  private initInputToOutputArrow(): void {
    const index = 0;
    const isNegative = this.wrap.getSummationSet().getSummationOperandSets()[index].isNegative();
    const y = 25;
    this.outputArrow = this.initArrow(130, y, 430, y);
    this.add(
      new IndexedTextView(this.scene, this.formatXText(index, isNegative), this.formatXIndex(index))
        .setAnchorX(1)
        .setPosition(130, y - 23)
    );
  }

  private initSumArrow(): void {
    this.initArrow(260, 60, 300, 60);
    this.add(
      new IndexedTextView(this.scene, this.formatSum(), "")
        .setAnchorX(1)
        .setPosition(280, 35)
    );
  }

  private initCCInputArrow(): void {
    const index = 0;
    const isNegative = this.wrap.getSummationSet().getSummationOperandSets()[index].isNegative();
    const y = 90;
    this.outputArrow = this.initArrow(130, y, 300, y);
    this.add(
      new IndexedTextView(this.scene, this.formatXText(index, isNegative), this.formatXIndex(index))
        .setAnchorX(1)
        .setPosition(130, y - 23)
    );
  }

  private initUInputArrows(): void {
    const count = this.xCount;
    const maxCount = ViewConfig.xInputs.maxCount;
    const summationOperandSets = this.wrap.getSummationSet().getSummationOperandSets();

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
        this.initXArrow(i, summationOperandSets[i].isNegative(), y);
        ++arrowSlotIndex;
      }
    }
  }

  private initUtoCCArrow(): void {
    this.initArrow(250, 90, 300, 90, true);
    this.add(
      new IndexedTextView(this.scene, this.pointsCount + "", "")
        .setAnchorX(0.5)
        .setPosition(275, 65)
    );
  }

  private initCCOutputArrow(): void {
    this.outputArrow = this.initArrow(370, 75, 430, 75, true);
    this.add(
      new IndexedTextView(this.scene, this.pointsCount + "", "")
        .setAnchorX(0.5)
        .setPosition(400, 45)
    );
  }

  private initArrow(fromX: number, fromY: number, toX: number, toY: number, crossed: boolean = false): Arrow {
    const arrow = crossed ? new CrossedArrow(this.scene) : new Arrow(this.scene);
    arrow.setDimensions(toX - fromX, toY - fromY);
    arrow.setPosition(fromX, fromY);
    this.add(arrow);
    return arrow;
  }

  private initEpsilon(y: number): void {
    this.add(
      new IndexedTextView(this.scene, "...", "")
        .setAnchorX(0.5)
        .setPosition(150, y - 15)
    );
  }

  private initXArrow(index: number, isNegative: boolean, y: number): void {
    this.initArrow(130, y, 200, y);
    this.add(
      new IndexedTextView(this.scene, this.formatXText(index, isNegative), this.formatXIndex(index))
        .setAnchorX(1)
        .setPosition(130, y - 20)
    );
  }

  private formatXText(index: number, isNegative: boolean): string {
    return (isNegative ? "-" : "") + "x" + StringUtils.multiply("'", index + 1);
  }

  private formatXIndex(_index: number): string {
    return this.config.xNumericIndexKey + this.wrap.getKey();
  }

  private formatSum(): string {
    const wrap = this.wrap;
    const signedNumbers = wrap.getSumSet().getSignedNumbers();
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
        result += `${signedNumber.getSignString()}${signedNumber.getAbsoluteValue()},`;
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
