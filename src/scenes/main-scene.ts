import { Config } from "../config/config";
import { MainLexer } from "../core/lexic/main-lexer";
import { Tokenizer } from "../core/tokens/tokenizer";
import { INewElementConfig } from "../view/ui/new-element-config.interface";
import { UI } from "../view/ui/ui";
import { UIEvent } from "../view/ui/ui-event.enum";
import { IWrapData } from "../view/wrap/wrap-data.interface";
import { WrapView } from "../view/wrap/wrap-view";
import { IWrapViewConfig } from "../view/wrap/wrap-view-config.interface";
import { saveAs } from "file-saver";
import { WrapLexer } from "../core/lexic/wrap-lexer";
import { HierarchyLexer } from "../core/lexic/hierarchy-lexer";
import { SuperWrap } from "../core/lexic/structures/super-wrap";

export class MainScene extends Phaser.Scene {
  private ui: UI;
  private wrapsData: IWrapData[] = [];
  private nextId: number = 0;

  constructor() {
    super({
      key: "main",
    });
  }

  public create(): void {
    this.initUI();
    this.listenUI();
  }

  private initUI(): void {
    this.ui = new UI();
  }

  private listenUI(): void {
    const uiEvents = this.ui.events;
    uiEvents.on(UIEvent.AddNewElement, this.onAddNewElement, this);
    uiEvents.on(UIEvent.DeleteElement, this.onDeleteElement, this);
    uiEvents.on(UIEvent.UpdateElement, this.onUpdateElement, this);
    uiEvents.on(UIEvent.MakeSnapshot, this.onMakeSnapshot, this);
  }

  private onAddNewElement(config: INewElementConfig): void {
    const tokens = new Tokenizer().tokenize(config.data);
    const tree = new MainLexer(new WrapLexer(true), new HierarchyLexer()).parse(tokens);
    const viewConfig: IWrapViewConfig = {
      xInputValueOffset: config.xInputValueOffset,
      xOutputValue: config.xOutputValue,
    };
    const superWraps = tree.getSuperWraps();
    superWraps.forEach((superWrap) => this.createSingleElement(superWrap, viewConfig));
    this.updateCanvasSize();
    this.updateWrapViewPositions();
  }

  private createSingleElement(superWrap: SuperWrap, viewConfig: IWrapViewConfig): void {
    const view = this.createWrapView(superWrap, viewConfig);
    const wrapData: IWrapData = {
      id: this.nextId++,
      superWrap,
      view,
      viewConfig,
    };
    this.wrapsData.push(wrapData);
    this.ui.onWrapAdded(wrapData);
  }

  private createWrapView(superWrap: SuperWrap, viewConfig: IWrapViewConfig): WrapView {
    const view = new WrapView(this, superWrap, viewConfig);
    this.add.existing(view);
    return view;
  }

  private onDeleteElement(id: number): void {
    const wrapsData = this.wrapsData;
    const index = wrapsData.findIndex((wrapData) => wrapData.id === id);
    const wrapData = wrapsData[index];
    wrapData.view.destroy();
    wrapsData.splice(index, 1);
    this.updateCanvasSize();
    this.updateWrapViewPositions();
  }

  private onUpdateElement(id: number): void {
    const wrapsData = this.wrapsData;
    const index = wrapsData.findIndex((wrapData) => wrapData.id === id);
    const wrapData = wrapsData[index];
    wrapData.view.destroy();
    wrapData.view = this.createWrapView(wrapData.superWrap, wrapData.viewConfig);
    this.updateWrapViewPositions();
  }

  private onMakeSnapshot(): void {
    this.renderer.snapshot((snapshot: HTMLImageElement) => {
      const canvas = document.createElement("canvas");
      canvas.width = snapshot.width;
      canvas.height = snapshot.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(snapshot, 0, 0);

      canvas.toBlob((blob) => {
        saveAs(blob, "dct.png");
      });
    });
  }

  private updateCanvasSize(): void {
    this.scale.setGameSize(Config.width, Config.wrapHeight * this.wrapsData.length);
  }

  private updateWrapViewPositions(): void {
    this.wrapsData.forEach((wrapData, i) => {
      wrapData.view.y = i * Config.wrapHeight;
    });
  }
}
