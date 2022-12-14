import { Math2 } from "../../core/utils/math/math2";
import { FileManager } from "../../utils/file-manager";
import { IWrapData } from "../wrap/wrap-data.interface";
import { IElementData } from "./element-data.interface";
import { INewElementConfig } from "./new-element-config.interface";
import { UIEvent } from "./ui-event.enum";

export class UI {
  public readonly events: EventEmitter = new Phaser.Events.EventEmitter();
  private static readonly xInputValueDefaultOffset = 10;
  private static readonly xOutputDefaultValue = 1;

  private newElementButton: HTMLInputElement;
  private readFromFileButton: HTMLInputElement;
  private snapshotButton: HTMLInputElement;
  private newElementTextArea: HTMLTextAreaElement;
  private newElementTemplate: HTMLElement;
  private newElementUIItem: HTMLElement;

  private elementsData: IElementData[] = [];
  private fileManager: FileManager;

  constructor() {
    this.initFileManager();
    this.findHTMLElements();
    this.removeNewElementTemplate();
    this.listenUIElements();
  }

  public onWrapAdded(wrapData: IWrapData): void {
    const element = this.createElement();
    const elementData: IElementData = {
      wrapData,
      element,
      deleteButton: element.getElementsByClassName("delete-button")[0] as HTMLElement,
      outputXIndex: element.getElementsByClassName("ui-output-x-index")[0] as HTMLInputElement,
      inputXIndex: element.getElementsByClassName("ui-input-x-index")[0] as HTMLInputElement,
    };
    this.listenElement(elementData);
    this.elementsData.push(elementData)
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
      xInputValueOffset: UI.xInputValueDefaultOffset,
      xOutputValue: UI.xOutputDefaultValue,
    };
    this.events.emit(UIEvent.AddNewElement, config);
  }

  private onReadFromFileButtonClick(): void {
    this.fileManager.import((data) => {
      const dataLines = data.split("\n");

      dataLines.forEach((dataLine) => {
        const config: INewElementConfig = {
          data: dataLine,
          xInputValueOffset: UI.xInputValueDefaultOffset,
          xOutputValue: UI.xOutputDefaultValue,
        };
        this.events.emit(UIEvent.AddNewElement, config);
      });
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

  private listenElement(elementData: IElementData): void {
    elementData.deleteButton.addEventListener("click", () => this.onElementDeleteClick(elementData));

    const outputXIndex = elementData.outputXIndex;
    outputXIndex.addEventListener("input", () => this.onElementOutputXChanged(elementData, outputXIndex));

    const inputXIndex = elementData.inputXIndex;
    inputXIndex.addEventListener("input", () => this.onElementInputXChanged(elementData, inputXIndex));
  }

  private onElementDeleteClick(elementData: IElementData): void {
    this.elementsData.filter((data) => data !== elementData);
    elementData.element.remove();
    this.events.emit(UIEvent.DeleteElement, elementData.wrapData.id);
  }

  private onElementOutputXChanged(elementData: IElementData, outputXIndex: HTMLInputElement): void {
    elementData.wrapData.viewConfig.xOutputValue = Math2.max(parseInt(outputXIndex.value) || 0, 0);
    this.events.emit(UIEvent.UpdateElement, elementData.wrapData.id);
  }

  private onElementInputXChanged(elementData: IElementData, inputXIndex: HTMLInputElement): void {
    elementData.wrapData.viewConfig.xInputValueOffset = Math2.max(parseInt(inputXIndex.value) || 0, 0);
    this.events.emit(UIEvent.UpdateElement, elementData.wrapData.id);
  }
}
