import { Config } from "../config/config";
import { MainLexer } from "../core/lexic/main-lexer";
import { Tokenizer } from "../core/tokens/tokenizer";
import { INewElementConfig } from "../view/ui/new-element-config.interface";
import { UI } from "../view/ui/ui";
import { UIEvent } from "../view/ui/ui-event.enum";
import { saveAs } from "file-saver";
import { WrapLexer } from "../core/lexic/wrap-lexer";
import { HierarchyLexer } from "../core/lexic/hierarchy-lexer";
import { SuperWrap } from "../core/lexic/structures/super-wrap";
import { ISuperWrapData } from "../view/wrap/super-wrap-data.interface";
import { ISuperWrapViewConfig } from "../view/wrap/super-wrap-view-config.interface";
import { SuperWrapView } from "../view/wrap/super-wrap-view";
import { ArrayUtils } from "../core/utils/array-utils";

export class MainScene extends Phaser.Scene {
  private lexer: MainLexer;
  private ui: UI;
  private superWrapsData: ISuperWrapData[] = [];
  private nextId: number = 0;

  constructor() {
    super({
      key: "main",
    });
  }

  public create(): void {
    this.initLexer();
    this.initUI();
    this.listenUI();
  }

  private initLexer(): void {
    this.lexer = new MainLexer(new WrapLexer(true), new HierarchyLexer());
  }

  private initUI(): void {
    this.ui = new UI();
  }

  private listenUI(): void {
    const uiEvents = this.ui.events;
    uiEvents.on(UIEvent.AddNewElements, this.onAddNewElement, this);
    uiEvents.on(UIEvent.DeleteElement, this.onDeleteElement, this);
    uiEvents.on(UIEvent.UpdateElement, this.onUpdateElement, this);
    uiEvents.on(UIEvent.MakeElementSnapshot, this.onMakeElementSnapshot, this);
    uiEvents.on(UIEvent.MakeSnapshot, this.onMakeSnapshot, this);
  }

  private onAddNewElement(config: INewElementConfig): void {
    const tokens = new Tokenizer().tokenize(config.data);
    const tree = this.lexer.parse(tokens);
    const superWraps = tree.getSuperWraps();
    superWraps.forEach((superWrap) => {
      const viewConfig: ISuperWrapViewConfig = {
        numericIndexOverride: null,
      };
      this.createSingleElement(superWrap, viewConfig);
    });
    this.updateCanvasSize();
    this.updateSuperWrapViewPositions();
  }

  private createSingleElement(superWrap: SuperWrap, viewConfig: ISuperWrapViewConfig): void {
    const view = this.createSuperWrapView(superWrap, viewConfig);
    const wrapData: ISuperWrapData = {
      id: this.nextId++,
      superWrap,
      view,
      viewConfig,
    };
    this.superWrapsData.push(wrapData);
    this.ui.onWrapAdded(wrapData);
  }

  private createSuperWrapView(superWrap: SuperWrap, viewConfig: ISuperWrapViewConfig): SuperWrapView {
    const view = new SuperWrapView(this, superWrap, viewConfig);
    this.add.existing(view);
    return view;
  }

  private onDeleteElement(id: number): void {
    const superWrapData = this.superWrapDataById(id);
    superWrapData.view.destroy();
    ArrayUtils.removeFirst(this.superWrapsData, superWrapData);
    this.updateCanvasSize();
    this.updateSuperWrapViewPositions();
  }

  private onUpdateElement(id: number): void {
    const superWrapData = this.superWrapDataById(id);
    const superWrap = superWrapData.superWrap;
    superWrapData.view.destroy();

    const numericIndexOverride = superWrapData.viewConfig.numericIndexOverride;
    numericIndexOverride && superWrap.setKey(numericIndexOverride + "");

    superWrapData.view = this.createSuperWrapView(superWrapData.superWrap, superWrapData.viewConfig);
    this.updateSuperWrapViewPositions();
  }

  private onMakeElementSnapshot(id: number): void {
    const superWrapData = this.superWrapDataById(id);
    const view = superWrapData.view;
    this.renderer.snapshotArea(view.x, view.y, Config.width, view.getHeight(), this.onSnapshotReady);
  }

  private onMakeSnapshot(): void {
    this.renderer.snapshot(this.onSnapshotReady);
  }

  private onSnapshotReady(snapshot: HTMLImageElement) {
    const canvas = document.createElement("canvas");
    canvas.width = snapshot.width;
    canvas.height = snapshot.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(snapshot, 0, 0);

    canvas.toBlob((blob) => {
      saveAs(blob, "dct.png");
    });
  }

  private superWrapDataById(id: number): ISuperWrapData {
    const superWrapsData = this.superWrapsData;
    const index = superWrapsData.findIndex((wrapData) => wrapData.id === id);
    return superWrapsData[index];
  }

  private updateCanvasSize(): void {
    const height = this.superWrapsData.reduce((value, superWrapData) => value + superWrapData.view.getHeight(), 0);
    this.scale.setGameSize(Config.width, height);
  }

  private updateSuperWrapViewPositions(): void {
    let y = 0;

    this.superWrapsData.forEach((superWrapData) => {
      const view = superWrapData.view;
      view.y = y;
      y += view.getHeight();
    });
  }
}
