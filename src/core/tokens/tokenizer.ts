import { SymbolType } from "../symbols/symbol-type.enum";
import { SymbolUtils } from "../symbols/symbol-utils";
import { TokenType } from "./token-type.enum";
import { IToken } from "./token.interface";

export class Tokenizer {
  private tokens: IToken[];
  private index: number;
  private lineNumber: number;
  private columnNumber: number;
  private input: string;
  private length: number;

  public tokenize(input: string): IToken[] {
    const tokens: IToken[] = [];
    this.tokens = tokens;
    this.index = 0;
    this.lineNumber = 0;
    this.columnNumber = 0;
    this.input = input;
    this.length = input.length;

    this.startIteration();

    return tokens;
  }

  private startIteration(): void {
    while (true) {
      if (this.isAtEnd()) {
        break;
      }

      const symbol = this.getCurrentSymbol();
      const symbolType = SymbolUtils.getSymbolType(symbol);

      switch (symbolType) {
        case SymbolType.Tabulation:
          this.readTabulation();
          break;

        case SymbolType.Numeric:
          this.readNumber();
          break;

        case SymbolType.Alphabetic:
          this.readAlphabetic();
          break;

        case SymbolType.Special:
          this.readSpecial();
          break;

        case SymbolType.Unknown:
          throw new Error(`Unsupported symbol at ${this.getCursor()}: ${symbol}`);
      }
    }
  }

  private readTabulation(): void {
    const symbol = this.getCurrentSymbol();

    this.advance();

    switch (symbol) {
      case "\n":
        this.handleNewLine();
        break;
    }
  }

  private readNumber(): void {
    let numberString = "";

    while (true) {
      if (this.isAtEnd()) {
        break;
      }

      const symbol = this.getCurrentSymbol();
      const symbolType = SymbolUtils.getSymbolType(symbol);
      let shouldEnd = false;

      switch (symbolType) {
        case SymbolType.Numeric:
          numberString += symbol;
          this.advance();
          break;

        default:
          shouldEnd = true;
          break;
      }

      if (shouldEnd) {
        break;
      }
    }

    this.addToken(TokenType.Number, numberString);
  }

  private readAlphabetic(): void {
    let alphabeticString = "";

    while (true) {
      if (this.isAtEnd()) {
        break;
      }

      const symbol = this.getCurrentSymbol();
      const symbolType = SymbolUtils.getSymbolType(symbol);
      let shouldEnd = false;

      switch (symbolType) {
        case SymbolType.Alphabetic:
          alphabeticString += symbol;
          this.advance();
          break;

        default:
          shouldEnd = true;
          break;
      }

      if (shouldEnd) {
        break;
      }
    }

    this.addToken(TokenType.Text, alphabeticString);
  }

  private readSpecial(): void {
    const symbol = this.getCurrentSymbol();

    switch (symbol) {
      case ">":
        throw new Error(`Unexpected symbol at ${this.getCursor()}: ${symbol}`);

      case "+":
        this.addToken(TokenType.Sign, "+");
        this.advance();
        break;

      case "-":
        this.advance();

        if (this.isAtEnd()) {
          this.addToken(TokenType.Sign, "-");
          break;
        }

        const nextSymbol = this.getCurrentSymbol();

        switch (nextSymbol) {
          case ">":
            this.addToken(TokenType.Punctuation, "->");
            this.advance();
            break;

          default:
            this.addToken(TokenType.Sign, "-");
            break;
        }
        break;

      default:
        this.addToken(TokenType.Punctuation, symbol);
        this.advance();
        break;
    }
  }

  private addToken(type: TokenType, value: string): void {
    this.tokens.push({
      type,
      value,
    });
  }

  private getCurrentSymbol(): string {
    return this.input[this.index];
  }

  private isAtEnd(): boolean {
    return this.index >= this.length;
  }

  private advance(): void {
    ++this.index;
    ++this.columnNumber;
  }

  private handleNewLine(): void {
    ++this.lineNumber;
    this.columnNumber = 0;
  }

  private getCursor(): string {
    return `${this.lineNumber}:${this.columnNumber}`;
  }
}
