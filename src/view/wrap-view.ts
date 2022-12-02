import { ViewConfig } from "../config/view-config";
import Wrap from "../core/lexic/structures/wrap";
import { Math2 } from "../core/utils/math/math2";
import { Arrow } from "./visual-elements/arrow";
import { IndexedTextView } from "./visual-elements/indexed-text-view";
import { RectangleWithTextView } from "./visual-elements/rectangle-with-text-view";

export class WrapView extends Phaser.GameObjects.Container {
  private wrap: Wrap;
  private nCount: number;
  private xCount: number;
  private pointsCount: number;

  constructor(scene: Scene, wrap: Wrap) {
    super(scene);

    this.wrap = wrap;

    this.calculateParameters();
    this.initURectangle();
    this.initPRectangle();
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
    uRectangle.setPosition(200, 100);
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

  private initArrows(): void {
    this.initSumArrow();
    this.initUInputArrows();
  }

  private initSumArrow(): void {
    this.initArrow(100, 60, 300, 60);
  }

  private initUInputArrows(): void {
    const xCount = this.xCount;
    const arrowsCount = Math2.min(xCount, ViewConfig.xInputs.maxCount);

    const hasSkip = (xCount !== arrowsCount);
    let skipFrom = -1;
    let skipTo = -1;

    if (hasSkip) {

    }

    for (let i = 0; i < arrowsCount; ++i) {
      const y = 100 + ViewConfig.xInputs.interval * (i + 1);
      this.initXArrow(i + 1, y);
    }
  }

  private initArrow(fromX: number, fromY: number, toX: number, toY: number): void {
    const arrow = new Arrow(this.scene);
    arrow.setDimensions(toX - fromX, toY - fromY);
    arrow.setPosition(fromX, fromY);
    this.add(arrow);
  }

  private initXArrow(index: number, y: number): void {
    this.initArrow(100, y, 200, y);
    this.add(new IndexedTextView(this.scene, "x", index + "").setPosition(70, y - 20));
  }
}
