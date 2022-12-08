import { IWrapData } from "../wrap/wrap-data.interface";

export interface IElementData {
  wrapData: IWrapData;
  element: HTMLElement;
  deleteButton: HTMLElement;
  outputXIndex: HTMLInputElement;
  inputXIndex: HTMLInputElement;
}
