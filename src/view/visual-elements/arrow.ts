import { ViewConfig } from "../../config/view-config";

export class Arrow extends Phaser.GameObjects.Container {
  private graphics: Graphics;

  constructor(scene: Scene) {
    super(scene);

    this.initGraphics();
    this.setDimensions(100, 0);
  }

  public setDimensions(x: number, y: number): void {
    const graphics = this.graphics;
    graphics.clear();

    graphics.lineStyle(ViewConfig.arrows.strokeThickness, ViewConfig.arrows.strokeColor);
    graphics.fillStyle(ViewConfig.arrows.fillColor, ViewConfig.arrows.fillAlpha);

    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(x, y);
    graphics.closePath();
    graphics.stroke();
  }

  private initGraphics(): void {
    const graphics = new Phaser.GameObjects.Graphics(this.scene);
    this.graphics = graphics;
    this.add(graphics);
  }
}
