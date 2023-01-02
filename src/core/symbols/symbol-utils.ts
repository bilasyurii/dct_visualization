import { SymbolType } from "./symbol-type.enum";

export class SymbolUtils {
  private static numeric0: number = "0".charCodeAt(0);
  private static numeric9: number = "9".charCodeAt(0);
  private static alphabeticCodeLowerA: number = "a".charCodeAt(0);
  private static alphabeticCodeLowerZ: number = "z".charCodeAt(0);
  private static alphabeticCodeUpperA: number = "A".charCodeAt(0);
  private static alphabeticCodeUpperZ: number = "Z".charCodeAt(0);

  private constructor() { }

  public static getSymbolType(symbol: string): SymbolType {
    const code = symbol.charCodeAt(0);

    if (code >= SymbolUtils.numeric0 && code <= SymbolUtils.numeric9) {
      return SymbolType.Numeric;
    }

    if (code >= SymbolUtils.alphabeticCodeLowerA && code <= SymbolUtils.alphabeticCodeLowerZ) {
      return SymbolType.Alphabetic;
    }

    if (code >= SymbolUtils.alphabeticCodeUpperA && code <= SymbolUtils.alphabeticCodeUpperZ) {
      return SymbolType.Alphabetic;
    }

    switch (symbol) {
      case " ":
      case "\t":
      case "\r":
      case "\n":
        return SymbolType.Tabulation;

      case "{":
      case "}":
      case "(":
      case ")":
      case ",":
      case "+":
      case "-":
      case ">":
      case ".":
        return SymbolType.Special;

      default:
        return SymbolType.Unknown;
    }
  }
}
