import { ViewConfig } from "../../config/view-config";

export class IndexedTextView extends Phaser.GameObjects.Container {
  private text: PhaserText;

  constructor(scene: Scene, text: string, bottomIndexText: string) {
    super(scene);

    this.initText(text);
    this.initBottomIndexText(bottomIndexText);
  }

  private initText(str: string): void {
    const text = new Phaser.GameObjects.Text(this.scene, 0, 0, str, {
      align: "left",
      fontFamily: ViewConfig.primaryText.fontFamily,
      fontSize: `${ViewConfig.primaryText.fontSize}pt`,
      color: Phaser.Display.Color.IntegerToColor(ViewConfig.primaryText.color).rgba,
    });
    this.text = text;
    this.add(text);
    text.setOrigin(0, 0);
  }

  private initBottomIndexText(str: string): void {
    const text = this.text;
    const indexText = this.createIndexText(str);
    indexText.setPosition(text.displayWidth, text.displayHeight);
  }

  private createIndexText(str: string): PhaserText {
    const text = new Phaser.GameObjects.Text(this.scene, 0, 0, str, {
      align: "left",
      fontFamily: ViewConfig.primaryText.fontFamily,
      fontSize: `${ViewConfig.primaryText.indexFontSize}pt`,
      color: Phaser.Display.Color.IntegerToColor(ViewConfig.primaryText.color).rgba,
    });
    this.add(text);
    text.setOrigin(0, 1);
    return text;
  }
}
