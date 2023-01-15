import { SuperWrap } from "../../core/lexic/structures/super-wrap";
import { Math2 } from "../../core/utils/math/math2";
import { ISuperWrapViewConfig } from "./super-wrap-view-config.interface";
import { Arrow } from "./visual-elements/arrow";
import { CrossedArrow } from "./visual-elements/crossed-arrow";
import { IndexedTextView } from "./visual-elements/indexed-text-view";
import { RectangleWithTextView } from "./visual-elements/rectangle-with-text-view";
import { WrapView } from "./wrap-view";
import { IWrapViewConfig } from "./wrap-view-config.interface";

export class SuperWrapView extends Phaser.GameObjects.Container {
  private superWrap: SuperWrap;
  private wrapViews: WrapView[];
  private uRectangle: RectangleWithTextView;
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

    this.wrapViews = wraps.map((wrap) => {
      const config: IWrapViewConfig = {
        xInputValueOffset: 0,
        xOutputValue: 0,
      };
      const view = new WrapView(scene, wrap, config);
      this.add(view);

      view.y = y;
      y += view.getHeight();

      return view;
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
    const wrapViews = this.wrapViews;
    const topWrapView = wrapViews[0];
    const bottomWrapView = wrapViews[wrapViews.length - 1];

    const width = 50;
    const offset = 20;
    const top = topWrapView.getOutputArrowY() + topWrapView.y - offset;
    const bottom = bottomWrapView.getOutputArrowY() + bottomWrapView.y + offset;
    const height = bottom - top;

    const uRectangle = new RectangleWithTextView(this.scene, "U", width, height);
    this.uRectangle = uRectangle;
    this.add(uRectangle);

    uRectangle.setPosition(430, top);
    uRectangle.getText().y = Math2.max(50, height * 0.5);
    uRectangle.getText().setOrigin(0.5);
  }

  private initUOutputArrow(): void {
    const uRectangle = this.uRectangle;
    const y = uRectangle.y + uRectangle.getRectangle().getHeight() * 0.5;

    this.initArrow(480, y, 550, y, true);
    this.add(
      new IndexedTextView(this.scene, this.pointsCount + "", "")
        .setAnchorX(0.5)
        .setPosition(515, y - 30)
    );
  }

  private initArrow(fromX: number, fromY: number, toX: number, toY: number, crossed: boolean = false): void {
    const arrow = crossed ? new CrossedArrow(this.scene) : new Arrow(this.scene);
    arrow.setDimensions(toX - fromX, toY - fromY);
    arrow.setPosition(fromX, fromY);
    this.add(arrow);
  }
}
