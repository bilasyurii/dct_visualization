import { SuperWrap } from "../../core/lexic/structures/super-wrap";
import { ISuperWrapViewConfig } from "./super-wrap-view-config.interface";
import { WrapView } from "./wrap-view";
import { IWrapViewConfig } from "./wrap-view-config.interface";

export class SuperWrapView extends Phaser.GameObjects.Container {
  private superWrap: SuperWrap;
  private config: ISuperWrapViewConfig;
  private wrapViews: WrapView[];
  private height_: number;

  constructor(scene: Scene, superWrap: SuperWrap, config: ISuperWrapViewConfig) {
    super(scene);

    this.superWrap = superWrap;
    this.config = config;

    this.initWraps();
  }

  private initWraps(): void {
    const wraps = this.superWrap.getWraps();
    let y = 0;

    this.wrapViews = wraps.map((wrap) => {
      const config: IWrapViewConfig = {
        xInputValueOffset: 0,
        xOutputValue: 0,
      };
      const view = new WrapView(this.scene, wrap, config);
      this.add(view);

      view.y = y;
      y += view.getHeight();

      return view;
    })
  }

  private calculateParameters(): void {
  }

  private initRectangles(): void {
  }

  private initArrows(): void {
  }
}
