import { TokenType } from "../tokens/token-type.enum";
import { IToken } from "../tokens/token.interface";
import { Point } from "./structures/point";
import { ScaledPoint } from "./structures/scaled-point";
import { ScaledPointSet } from "./structures/scaled-point-set";
import { SignType } from "./structures/sign-type.enum";
import { SignedNumber } from "./structures/signed-number";
import { SumSet } from "./structures/sum-set";
import { SummationSet } from "./structures/summation-set";
import Wrap from "./structures/wrap";

export class Lexer {
  private tokens: IToken[];
  private index: number;
  private length: number;
  private scaledPointSet: ScaledPointSet;
  private sumSet: SumSet;
  private summationSet: SummationSet;
  private wrap: Wrap;

  constructor() {}

  public parse(tokens: IToken[]): Wrap {
    this.tokens = tokens;
    this.index = 0;
    this.length = tokens.length;
    this.scaledPointSet = new ScaledPointSet();
    this.sumSet = new SumSet();
    this.summationSet = new SummationSet();
    this.wrap = new Wrap(this.scaledPointSet, this.sumSet, this.summationSet);

    this.startParsing();

    return this.wrap;
  }

  private startParsing(): void {
    this.readScaledPointSet();
    this.readArrow();
    this.readSumSet();
    this.readXSeparator();
  }

  private readScaledPointSet(): void {
    while (true) {
      if (this.isAtEnd()) {
        break;
      }

      const hasMore = this.readScaledPoint();

      if (!hasMore) {
        break;
      }
    }
  }

  private readArrow(): void {
    this.expectToken(this.peekToken(), TokenType.Punctuation, "->");
  }

  private readSumSet(): void {
    this.expectToken(this.peekToken(), TokenType.Punctuation, "(");

    while (true) {
      if (this.isAtEnd()) {
        break;
      }

      const hasMore = this.readSumSetElement();

      if (!hasMore) {
        break;
      }
    }

    this.expectToken(this.peekToken(), TokenType.Punctuation, ")");
  }

  private readXSeparator(): void {
    this.expectToken(this.peekToken(), TokenType.Punctuation, "(");
    this.expectToken(this.peekToken(), TokenType.Text, "X");
    this.expectToken(this.peekToken(), TokenType.Punctuation, ")");
  }

  // returns true when there are more points to read
  private readScaledPoint(): boolean {
    if (this.isArrow()) {
      return false;
    }

    const signedNumber = this.readSignedNumber();
    const point = this.readPoint();
    const scaledPoint = new ScaledPoint(signedNumber, point);
    this.scaledPointSet.addScaledPoint(scaledPoint);

    return true;
  }

  private readSignedNumber(forceSign = false): SignedNumber {
    let signToken = this.getCurrentToken();
    let absoluteValueToken: IToken;

    switch (signToken.type) {
      case TokenType.Number:
        if (forceSign) {
          this.throwExpectedError(signToken, "a sign");
        }

        absoluteValueToken = signToken;
        signToken = null;
        this.advance();
        break;

      case TokenType.Sign:
        this.advance();
        absoluteValueToken = this.getCurrentToken();

        switch (absoluteValueToken.type) {
          case TokenType.Number:
            this.advance();
            break;

          default:
            this.throwExpectedError(signToken, "a number");
        }
        break;

      default:
        this.throwExpectedError(signToken, forceSign ? "a sign" : "a sign or a number");
    }

    return new SignedNumber(this.getSignType(signToken), parseInt(absoluteValueToken.value));
  }

  private readPoint(): Point {
    this.expectToken(this.peekToken(), TokenType.Punctuation, "{");
    const x = this.getNumber();
    this.expectToken(this.peekToken(), TokenType.Punctuation, ",");
    const y = this.getNumber();
    this.expectToken(this.peekToken(), TokenType.Punctuation, "}");
    return new Point(x, y);
  }

  private readSumSetElement(): boolean {
    const token = this.getCurrentToken();

    if (token.type === TokenType.Punctuation && token.value === ")") {
      return false;
    }

    const signedNumber = this.readSignedNumber(true);
    this.sumSet.addSignedNumber(signedNumber);

    return true;
  }

  private expectToken(token: IToken, expectedType: TokenType, expectedValue: string): void {
    if (token.type !== expectedType || token.value !== expectedValue) {
      this.throwExpectedError(token, `${expectedValue} (${expectedType})`);
    }
  }

  private expectTokenType(token: IToken, expectedType: TokenType): void {
    if (token.type !== expectedType) {
      this.throwExpectedError(token, expectedType);
    }
  }

  private throwExpectedError(token: IToken, expected: string): void {
    throw new Error(`Expected ${expected}, but found ${token.value} (${token.type})`);
  }

  private isArrow(): boolean {
    const token = this.getCurrentToken();
    return token.type === TokenType.Punctuation && token.value === "->";
  }

  private getSignType(token: IToken): SignType {
    if (token) {
      switch (token.value) {
        case "+":
          return SignType.Positive;

        case "-":
          return SignType.Negative;
      }
    } else {
      return SignType.None;
    }

    throw new Error(`Expected a sign, but found ${token.value} (${token.type})`);
  }

  private getNumber(): number {
    const token = this.peekToken();
    this.expectTokenType(token, TokenType.Number);
    return parseInt(token.value);
  }

  private peekToken(): IToken {
    const token = this.getCurrentToken();
    this.advance();
    return token;
  }

  private getCurrentToken(): IToken {
    const token = this.tokens[this.index];

    if (!token) {
      throw new Error("Unexpected end of data.");
    }

    return token;
  }

  private isAtEnd(): boolean {
    return this.index >= this.length;
  }

  private advance(): void {
    ++this.index;
  }
}
