import { ViewConfig } from "../../../config/view-config";
import { RectangleView } from "./rectangle-view";

export class RectangleWithTextView extends Phaser.GameObjects.Container {
  private rectangle: RectangleView;
  private text: PhaserText;

  constructor(scene: Scene, text: string, width: number, height: number) {
    super(scene);

    this.initRectangleView(width, height);
    this.initText(text, width);
  }

  public getRectangle(): RectangleView {
    return this.rectangle;
  }

  public getText(): PhaserText {
    return this.text;
  }

  private initRectangleView(width: number, height: number): void {
    const rectangleView = new RectangleView(this.scene);
    this.rectangle = rectangleView;
    rectangleView.setDimensions(width, height);
    this.add(rectangleView);
  }

  private initText(str: string, width: number): void {
    const text = new Phaser.GameObjects.Text(this.scene, 0, 5, str, {
      align: "left",
      fontFamily: ViewConfig.primaryText.fontFamily,
      fontSize: `${ViewConfig.primaryText.fontSize}pt`,
      color: Phaser.Display.Color.IntegerToColor(ViewConfig.primaryText.color).rgba,
    });
    this.text = text;
    text.setOrigin(0, 0);
    text.x = (width - text.width) * 0.5;
    this.add(text);
  }
}
