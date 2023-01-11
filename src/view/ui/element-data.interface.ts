import { ISuperWrapData } from "../wrap/super-wrap-data.interface";

export interface IElementData {
  superWrapData: ISuperWrapData;
  element: HTMLElement;
  deleteButton: HTMLElement;
  numericIndex: HTMLInputElement;
}
