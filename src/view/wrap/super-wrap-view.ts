import { SuperWrap } from "../../core/lexic/structures/super-wrap";
import { ISuperWrapViewConfig } from "./super-wrap-view-config.interface";
import { Arrow } from "./visual-elements/arrow";
import { CrossedArrow } from "./visual-elements/crossed-arrow";
import { IndexedTextView } from "./visual-elements/indexed-text-view";
import { RectangleWithTextView } from "./visual-elements/rectangle-with-text-view";
import { WrapView } from "./wrap-view";
import { IWrapViewConfig } from "./wrap-view-config.interface";

export class SuperWrapView extends Phaser.GameObjects.Container {
  private superWrap: SuperWrap;
  private config: ISuperWrapViewConfig;
  private height_: number;
  private pointsCount: number;

  constructor(scene: Scene, superWrap: SuperWrap, config: ISuperWrapViewConfig) {
    super(scene);

    this.superWrap = superWrap;
    this.config = config;

    this.calculateParameters();
    this.initWraps();
    this.initRectangles();
    this.initArrows();
  }

  private calculateParameters(): void {
    this.pointsCount = this.superWrap.getWraps()[0].calculatePointsCount();
  }

  private initWraps(): void {
    const scene = this.scene;
    const wraps = this.superWrap.getWraps();
    let y = 0;

    wraps.forEach((wrap) => {
      const config: IWrapViewConfig = {
        xInputValueOffset: 0,
        xOutputValue: 0,
      };
      const view = new WrapView(scene, wrap, config);
      this.add(view);

      view.y = y;
      y += view.getHeight();
    });

    this.height_ = y;
  }

  private initRectangles(): void {
    this.initURectangle();
  }

  private initArrows(): void {
    this.initUOutputArrow();
  }

  private initURectangle(): void {
    const width = 50;
    const height = this.height_ - 90;
    const uRectangle = new RectangleWithTextView(this.scene, "U", width, height);
    this.add(uRectangle);
    uRectangle.setPosition(430, 60);
    uRectangle.getText().y = 50;
  }

  private initUOutputArrow(): void {
    this.initArrow(480, 180, 550, 180, true);
    this.add(new IndexedTextView(this.scene, this.pointsCount + "", "").setAnchorX(0.5).setPosition(515, 150));
  }

  private initArrow(fromX: number, fromY: number, toX: number, toY: number, crossed: boolean = false): void {
    const arrow = crossed ? new CrossedArrow(this.scene) : new Arrow(this.scene);
    arrow.setDimensions(toX - fromX, toY - fromY);
    arrow.setPosition(fromX, fromY);
    this.add(arrow);
  }
}
