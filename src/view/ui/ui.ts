import { Math2 } from "../../core/utils/math/math2";
import { FileManager } from "../../utils/file-manager";
import { ISuperWrapData } from "../wrap/super-wrap-data.interface";
import { IElementData } from "./element-data.interface";
import { INewElementConfig } from "./new-element-config.interface";
import { UIEvent } from "./ui-event.enum";

export class UI {
  public readonly events: EventEmitter = new Phaser.Events.EventEmitter();

  private newElementButton: HTMLInputElement;
  private readFromFileButton: HTMLInputElement;
  private snapshotButton: HTMLInputElement;
  private newElementTextArea: HTMLTextAreaElement;
  private newElementTemplate: HTMLElement;
  private newElementUIItem: HTMLElement;
  private legendText: HTMLDivElement;

  private elementsData: IElementData[] = [];
  private fileManager: FileManager;

  constructor() {
    this.initFileManager();
    this.findHTMLElements();
    this.removeNewElementTemplate();
    this.listenUIElements();
  }

  public onWrapAdded(superWrapData: ISuperWrapData): void {
    const element = this.createElement();
    const elementData: IElementData = {
      superWrapData,
      element,
      deleteButton: element.getElementsByClassName("delete-button")[0] as HTMLElement,
      snapshotButton: element.getElementsByClassName("element-snapshot-button")[0] as HTMLElement,
      numericIndex: element.getElementsByClassName("ui-numeric-index")[0] as HTMLInputElement,
    };
    this.configureElement(elementData);
    this.listenElement(elementData);
    this.elementsData.push(elementData)
  }

  public updateLegendText(text: string): void {
    this.legendText.innerHTML = text;
  }

  private initFileManager(): void {
    this.fileManager = new FileManager();
  }

  private findHTMLElements(): void {
    this.newElementButton = document.getElementById("newElementButton") as HTMLInputElement;
    this.readFromFileButton = document.getElementById("readFromFileButton") as HTMLInputElement;
    this.snapshotButton = document.getElementById("snapshotButton") as HTMLInputElement;
    this.newElementTextArea = document.getElementById("newElementTextArea") as HTMLTextAreaElement;
    this.newElementTemplate = document.getElementsByClassName("ui-item-element")[0] as HTMLElement;
    this.newElementUIItem = document.getElementById("newElementUIItem") as HTMLElement;
    this.legendText = document.getElementById("legendText") as HTMLDivElement;
  }

  private removeNewElementTemplate(): void {
    this.newElementTemplate.remove();
  }

  private listenUIElements(): void {
    this.newElementButton.addEventListener("click", () => this.onNewElementButtonClick());
    this.readFromFileButton.addEventListener("click", () => this.onReadFromFileButtonClick());
    this.snapshotButton.addEventListener("click", () => this.onSnapshotButtonClick());
  }

  private onNewElementButtonClick(): void {
    const config: INewElementConfig = {
      data: this.newElementTextArea.value,
    };
    this.events.emit(UIEvent.AddNewElements, config);
  }

  private onReadFromFileButtonClick(): void {
    this.fileManager.import((data) => {
      const config: INewElementConfig = {
        data,
      };
      this.events.emit(UIEvent.AddNewElements, config);
    });
  }

  private onSnapshotButtonClick(): void {
    this.events.emit(UIEvent.MakeSnapshot);
  }

  private createElement(): HTMLElement {
    const element = this.newElementTemplate.cloneNode(true);
    const newElementUIItem = this.newElementUIItem;
    newElementUIItem.parentNode.insertBefore(element, newElementUIItem);
    return element as HTMLElement;
  }

  private configureElement(elementData: IElementData): void {
    const numericIndexKey = elementData.superWrapData.superWrap.getKey();
    elementData.numericIndex.value = numericIndexKey;

    elementData.element.style.height = elementData.superWrapData.view.getHeight() + "px";
  }

  private listenElement(elementData: IElementData): void {
    elementData.deleteButton.addEventListener("click", () => this.onElementDeleteClick(elementData));
    elementData.snapshotButton.addEventListener("click", () => this.onElementSnapshotClick(elementData));

    const numericIndex = elementData.numericIndex;
    numericIndex.addEventListener("input", () => this.onElementNumericIndexChanged(elementData, numericIndex));
  }

  private onElementDeleteClick(elementData: IElementData): void {
    this.elementsData.filter((data) => data !== elementData);
    elementData.element.remove();
    this.events.emit(UIEvent.DeleteElement, elementData.superWrapData.id);
  }

  private onElementSnapshotClick(elementData: IElementData): void {
    this.events.emit(UIEvent.MakeElementSnapshot, elementData.superWrapData.id);
  }

  private onElementNumericIndexChanged(elementData: IElementData, numericIndex: HTMLInputElement): void {
    elementData.superWrapData.viewConfig.numericIndexOverride = Math2.max(parseInt(numericIndex.value) || 0, 0);
    this.events.emit(UIEvent.UpdateElement, elementData.superWrapData.id);
  }
}
