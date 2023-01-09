import { TokenType } from "../tokens/token-type.enum";
import { IToken } from "../tokens/token.interface";
import { ILexer } from "./lexer.interface";

export abstract class BaseLexer<T> implements ILexer<T> {
  protected tokens: IToken[];
  protected index: number;
  protected length: number;
  protected result: T;

  public parse(tokens: IToken[]): T {
    this.tokens = tokens;
    this.index = 0;
    this.length = tokens.length;

    this.startParsing();

    return this.result;
  }

  protected abstract startParsing(): void;

  protected peekToken(): IToken {
    const token = this.getCurrentToken();
    this.advance();
    return token;
  }

  protected getCurrentToken(): IToken {
    const token = this.tokens[this.index];

    if (!token) {
      BaseLexer.throwUnexpectedEndError();
    }

    return token;
  }

  protected isAtEnd(): boolean {
    return this.index >= this.length;
  }

  protected advance(): void {
    ++this.index;
  }

  protected static checkToken(token: IToken, expectedType: TokenType, expectedValue: string): boolean {
    if (!token || token.type !== expectedType || token.value !== expectedValue) {
      return false;
    }

    return true;
  }

  protected static checkTokenType(token: IToken, expectedType: TokenType): boolean {
    if (!token || token.type !== expectedType) {
      return false;
    }

    return true;
  }

  protected static expectToken(token: IToken, expectedType: TokenType, expectedValue: string): void {
    if (!BaseLexer.checkToken(token, expectedType, expectedValue)) {
      if (token) {
        BaseLexer.throwExpectedError(token, `${expectedValue} (${expectedType})`);
      } else {
        BaseLexer.throwUnexpectedEndError();
      }
    }
  }

  protected static expectTokenType(token: IToken, expectedType: TokenType): void {
    if (!BaseLexer.checkTokenType(token, expectedType)) {
      if (token) {
        BaseLexer.throwExpectedError(token, expectedType);
      } else {
        BaseLexer.throwUnexpectedEndError();
      }
    }
  }

  protected static throwExpectedError(token: IToken, expected: string): void {
    throw new Error(`Expected ${expected}, but found ${token.value} (${token.type})`);
  }

  protected static throwUnexpectedEndError(): void {
    throw new Error("Unexpected end of data.");
  }
}