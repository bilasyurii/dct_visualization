export class ArrayUtils {
  private constructor() { }

  public static removeFirst<T>(array: T[], value: T): boolean {
    const count = array.length;

    for (let i = 0; i < count; ++i) {
      if (array[i] === value) {
        array.splice(i, 1);
        return true;
      }
    }

    return false;
  }

  public static initArray<T>(width: number, height: number, value: T): T[][] {
    const arr: T[][] = [];

    for (let y = 0; y < height; ++y) {
      const row: T[] = [];
      arr.push(row);

      for (let x = 0; x < width; ++x) {
        row.push(value);
      }
    }

    return arr;
  }

  public static shuffle<T>(array: T[]): T[] {
    const length = array.length;

    for (let i = 0; i < length; ++i) {
      const j = ~~(Math.random() * length);
      const temp = array[j];
      array[j] = array[i];
      array[i] = temp;
    }

    return array;
  }

  public static repeat<T>(pattern: T[], amount: number): T[] {
    const result: T[] = [];
    const patternLength = pattern.length;

    for (let i = 0; i < amount; ++i) {
      for (let j = 0; j < patternLength; ++j) {
        result.push(pattern[j]);
      }
    }

    return result;
  }

  public static pick<T>(array: T[], amount: number): T[] {
    return ArrayUtils.shuffle(array.slice()).slice(0, amount);
  }

  public static copy<T>(from: T[], to: T[]): T[] {
    const length = from.length;

    for (let i = 0; i < length; ++i) {
      to.push(from[i]);
    }

    return to;
  }

  public static mirrorX<T>(array: T[][]): T[][] {
    const result: T[][] = [];
    const rows = array.length;

    for (let i = 0; i < rows; ++i) {
      const row = array[i];
      const mirroredRow: T[] = [];
      result.push(mirroredRow);

      for (let j = row.length - 1; j >= 0; --j) {
        mirroredRow.push(row[j]);
      }
    }

    return result;
  }

  public static mirrorY<T>(array: T[][]): T[][] {
    const result: T[][] = [];
    const rows = array.length;

    for (let i = 0, j = rows - 1; i < rows; ++i, --j) {
      result.push(array[j].slice(0));
    }

    return result;
  }

  public static mirrorXY<T>(array: T[][]): T[][] {
    return ArrayUtils.mirrorX(ArrayUtils.mirrorY(array));
  }

  public static rotate90<T>(a: T[][]): T[][] {
    const w = a.length;
    const h = a[0].length;
    let b = new Array(h);
  
    for (let y = 0; y < h; y++) {
      b[y] = new Array(w);
  
      for (let x = 0; x < w; x++) {
        b[y][x] = a[w - 1 - x][y];
      }
    }
  
    return b;
  }
  
  public static rotate180<T>(a: T[][]): T[][] {
    const w = a[0].length;
    const h = a.length;
    let b = new Array(h);
  
    for (let y = 0; y < h; y++) {
      let n = h - 1 - y;
      b[n] = new Array(w);
  
      for (let x = 0; x < w; x++) {
        b[n][w - 1 - x] = a[y][x];
      }
    }
  
    return b;
  }
  
  public static rotate270<T>(a: T[][]): T[][] {
    const w = a.length;
    const h = a[0].length;
    let b = new Array(h);
  
    for (let y = 0; y < h; y++) {
      b[y] = new Array(w);
  
      for (let x = 0; x < w; x++) {
        b[y][x] = a[x][h - 1 - y];
      }
    }
  
    return b;
  }

  public static crossover<T>(rows: T[], cols: T[]): T[][] {
    const result: T[][] = [];
    const rowsCount = rows.length;
    const colsCount = cols.length;

    for (let i = 0; i < rowsCount; ++i) {
      for (let j = 0; j < colsCount; ++j) {
        result.push([rows[i], cols[j]]);
      }
    }

    return result;
  }

  public static clone2d<T>(array: T[][]): T[][] {
    const result: T[][] = [];
    const rows = array.length;

    for (let i = 0; i < rows; ++i) {
      const row = array[i];
      const cols = row.length;
      const clonedRow: T[] = [];
      result.push(clonedRow);

      for (let j = 0; j < cols; ++j) {
        clonedRow.push(row[j]);
      }
    }

    return result;
  }
}
