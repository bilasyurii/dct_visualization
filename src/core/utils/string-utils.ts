export class StringUtils {
  private constructor() { }

  public static multiply(str: string, times: number): string {
    let result = "";

    for (let i = 0; i < times; ++i) {
      result += str;
    }

    return result;
  }
}
