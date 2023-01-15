import { ISuperWrapData } from "../wrap/super-wrap-data.interface";

export interface IElementData {
  superWrapData: ISuperWrapData;
  element: HTMLElement;
  deleteButton: HTMLElement;
  snapshotButton: HTMLElement;
  numericIndex: HTMLInputElement;
}
