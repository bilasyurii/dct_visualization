import { ViewConfig } from "../../../config/view-config";

export class RectangleView extends Phaser.GameObjects.Container {
  private graphics: Graphics;
  private width_: number = 0;
  private height_: number = 0;

  constructor(scene: Scene) {
    super(scene);

    this.initGraphics();
  }

  public getWidth(): number {
    return this.width_;
  }

  public getHeight(): number {
    return this.height_;
  }

  public setDimensions(width: number, height: number): void {
    this.width_ = width;
    this.height_ = height;

    const graphics = this.graphics;
    graphics.clear();

    graphics.fillStyle(ViewConfig.rectangles.fillColor, ViewConfig.rectangles.fillAlpha);
    graphics.fillRect(0, 0, width, height);

    graphics.lineStyle(ViewConfig.rectangles.strokeThickness, ViewConfig.rectangles.strokeColor);
    graphics.strokeRect(0, 0, width, height);
  }

  private initGraphics(): void {
    const graphics = new Phaser.GameObjects.Graphics(this.scene);
    this.graphics = graphics;
    this.add(graphics);
  }
}
