import { ViewConfig } from "../../../config/view-config";

export class IndexedTextView extends Phaser.GameObjects.Container {
  private text: PhaserText;
  private bottomIndexText: PhaserText;

  constructor(scene: Scene, text: string, bottomIndexText: string) {
    super(scene);

    this.initText(text);
    this.initBottomIndexText(bottomIndexText);
    this.setAnchorX(0);
  }

  public setAnchorX(value: number): this {
    const text = this.text;
    const bottomIndexText = this.bottomIndexText;
    const textWidth = text.displayWidth;
    const bottomIndexTextWidth = bottomIndexText.displayWidth;
    const width = textWidth + bottomIndexTextWidth;
    const offsetX = width * -value;
    text.setPosition(offsetX, 0);
    bottomIndexText.setPosition(offsetX + textWidth, text.displayHeight);
    return this;
  }

  private initText(str: string): void {
    const text = new Phaser.GameObjects.Text(this.scene, 0, 0, str, {
      align: "left",
      fontFamily: ViewConfig.primaryText.fontFamily,
      fontSize: `${ViewConfig.primaryText.fontSize}pt`,
      color: Phaser.Display.Color.IntegerToColor(ViewConfig.primaryText.color).rgba,
      resolution: ViewConfig.primaryText.resolution,
    });
    this.text = text;
    this.add(text);
    text.setOrigin(0, 0);
  }

  private initBottomIndexText(str: string): void {
    this.bottomIndexText = this.createIndexText(str);
  }

  private createIndexText(str: string): PhaserText {
    const text = new Phaser.GameObjects.Text(this.scene, 0, 0, str, {
      align: "left",
      fontFamily: ViewConfig.primaryText.fontFamily,
      fontSize: `${ViewConfig.primaryText.indexFontSize}pt`,
      color: Phaser.Display.Color.IntegerToColor(ViewConfig.primaryText.color).rgba,
      resolution: ViewConfig.primaryText.resolution,
    });
    this.add(text);
    text.setOrigin(0, 1);
    return text;
  }
}
