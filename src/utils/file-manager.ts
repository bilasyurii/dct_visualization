import { saveAs } from 'file-saver';

export type FileImportCallback = (data: string) => void;

export class FileManager {
  private input: HTMLInputElement = null;
  private callback: FileImportCallback = null;

  constructor() {
    this.initInput();
  }
  
  public export(content: string, name: string): void {
    saveAs(new Blob([content]), name);
  }

  public import(callback: FileImportCallback): void {
    this.callback = callback;
    this.input.click();
  }

  private initInput(): void {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      this.callback(readerEvent.target.result as string);
    };

    const input = document.createElement('input');
    this.input = input;
    input.type = 'file';
    input.onchange = () => {
      const file = input.files[0];
      reader.readAsText(file);
      input.value = '';
    };
  }
}
