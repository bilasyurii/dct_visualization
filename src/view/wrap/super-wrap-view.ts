import { SuperWrap } from "../../core/lexic/structures/super-wrap";
import { ISuperWrapViewConfig } from "./super-wrap-view-config.interface";
import { WrapView } from "./wrap-view";

export class SuperWrapView extends Phaser.GameObjects.Container {
  private superWrap: SuperWrap;
  private config: ISuperWrapViewConfig;

  constructor(scene: Scene, superWrap: SuperWrap, config: ISuperWrapViewConfig) {
    super(scene);

    this.superWrap = superWrap;
    this.config = config;

    this.calculateParameters();
    this.initRectangles();
    this.initArrows();

    this.add(new WrapView(scene, superWrap.getWraps()[0], {
      xInputValueOffset: 0,
      xOutputValue: 0,
    }));
  }

  private calculateParameters(): void {
  }

  private initRectangles(): void {
  }

  private initArrows(): void {
  }
}
