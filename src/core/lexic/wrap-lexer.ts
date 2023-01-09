import { TokenType } from "../tokens/token-type.enum";
import { IToken } from "../tokens/token.interface";
import { BaseLexer } from "./base-lexer.abstract";
import { Point } from "./structures/point";
import { ScaledPoint } from "./structures/scaled-point";
import { ScaledPointSet } from "./structures/scaled-point-set";
import { SignType } from "./structures/sign-type.enum";
import { SignedNumber } from "./structures/signed-number";
import { SumSet } from "./structures/sum-set";
import { SummationOperand } from "./structures/summation-operand";
import { SummationOperandSet } from "./structures/summation-operand-set";
import { SummationSet } from "./structures/summation-set";
import { Wrap } from "./structures/wrap";

export class WrapLexer extends BaseLexer<Wrap> {
  private shortened: boolean;
  private scaledPointSet: ScaledPointSet;
  private sumSet: SumSet;
  private summationSet: SummationSet;

  constructor(shortened: boolean = true) {
    super();

    this.shortened = shortened;
  }

  protected startParsing(): void {
    if (!this.shortened) {
      this.scaledPointSet = new ScaledPointSet();
    }

    this.sumSet = new SumSet();
    this.summationSet = new SummationSet();
    this.result = new Wrap(this.scaledPointSet, this.sumSet, this.summationSet);

    if (!this.shortened) {
      this.readScaledPointSet();
      this.readArrow();
    }

    this.readSumSet();
    this.readXSeparator();
    this.readSummationSet();
    this.skipNewLinesIfFound();

    if (!this.isAtEnd()) {
      BaseLexer.throwExpectedError(this.getCurrentToken(), "end of data");
    }
  }

  private readScaledPointSet(): void {
    while (true) {
      if (this.isAtEnd()) {
        break;
      }

      const scaledPoint = this.readScaledPoint();

      if (scaledPoint) {
        this.scaledPointSet.addScaledPoint(scaledPoint);
      } else {
        break;
      }
    }
  }

  private readArrow(): void {
    BaseLexer.expectToken(this.peekToken(), TokenType.Punctuation, "->");
  }

  private readSumSet(): void {
    BaseLexer.expectToken(this.peekToken(), TokenType.Punctuation, "(");

    while (true) {
      if (this.isAtEnd()) {
        break;
      }

      const signedNumber = this.readSumSetElement();

      if (signedNumber) {
        this.sumSet.addSignedNumber(signedNumber);
      } else {
        break;
      }
    }

    BaseLexer.expectToken(this.peekToken(), TokenType.Punctuation, ")");
  }

  private readXSeparator(): void {
    BaseLexer.expectToken(this.peekToken(), TokenType.Punctuation, "(");
    BaseLexer.expectToken(this.peekToken(), TokenType.Text, "X");
    BaseLexer.expectToken(this.peekToken(), TokenType.Punctuation, ")");
  }

  private readSummationSet(): void {
    BaseLexer.expectToken(this.peekToken(), TokenType.Punctuation, "{");

    while (true) {
      if (this.isAtEnd()) {
        break;
      }

      const summationOperandSet = this.readSummationOperandSet();

      if (summationOperandSet) {
        this.summationSet.addSummationOperandSet(summationOperandSet);
      } else {
        break;
      }
    }

    BaseLexer.expectToken(this.peekToken(), TokenType.Punctuation, "}");
  }

  private skipNewLinesIfFound() {
    while (true) {
      if (this.isAtEnd()) {
        break;
      }

      const token = this.getCurrentToken();

      if (BaseLexer.checkToken(token, TokenType.NewLine, "\n")) {
        this.advance();
      } else {
        break;
      }
    }
  }

  // returns true when there are more points to read
  private readScaledPoint(): ScaledPoint {
    if (this.isArrow()) {
      return null;
    }

    const signedNumber = this.readSignedNumber();
    const point = this.readPoint();
    return new ScaledPoint(signedNumber, point);
  }

  private readSignedNumber(forceSign = false): SignedNumber {
    let signToken = this.getCurrentToken();
    let absoluteValueToken: IToken;

    switch (signToken.type) {
      case TokenType.Number:
        if (forceSign) {
          BaseLexer.throwExpectedError(signToken, "a sign");
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
            BaseLexer.throwExpectedError(signToken, "a number");
        }
        break;

      default:
        BaseLexer.throwExpectedError(signToken, forceSign ? "a sign" : "a sign or a number");
    }

    return new SignedNumber(this.getSignType(signToken), parseInt(absoluteValueToken.value));
  }

  private readPoint(): Point {
    BaseLexer.expectToken(this.peekToken(), TokenType.Punctuation, "{");
    const x = this.getNumber();
    BaseLexer.expectToken(this.peekToken(), TokenType.Punctuation, ",");
    const y = this.getNumber();
    BaseLexer.expectToken(this.peekToken(), TokenType.Punctuation, "}");
    return new Point(x, y);
  }

  private readSumSetElement(): SignedNumber {
    const token = this.getCurrentToken();

    if (token.type === TokenType.Punctuation && token.value === ")") {
      return null;
    }

    return this.readSignedNumber(true);
  }

  private readSummationOperandSet(): SummationOperandSet {
    const signToken = this.getCurrentToken();

    if (signToken.type === TokenType.Punctuation && signToken.value === "}") {
      return null;
    }

    BaseLexer.expectTokenType(signToken, TokenType.Sign);
    this.advance();

    const summationOperandSet = new SummationOperandSet(this.getSignType(signToken));

    let scopeToken = this.getCurrentToken();

    if (scopeToken.type === TokenType.Punctuation && scopeToken.value === "(") {
      this.advance();
    } else {
      scopeToken = null;
    }

    while (true) {
      if (this.isAtEnd()) {
        break;
      }

      const summationOperand = this.readSummationOperand();

      if (summationOperand) {
        summationOperandSet.addSummationOperand(summationOperand);
      } else {
        break;
      }
    }

    if (scopeToken) {
      BaseLexer.expectToken(this.peekToken(), TokenType.Punctuation, ")");
    }

    return summationOperandSet;
  }

  private readSummationOperand(): SummationOperand {
    const xToken = this.getCurrentToken();

    if (xToken.type !== TokenType.Text || xToken.value !== "x") {
      return null;
    }

    this.advance();
    BaseLexer.expectToken(this.peekToken(), TokenType.Punctuation, "(");

    const number = this.getNumber();

    BaseLexer.expectToken(this.peekToken(), TokenType.Punctuation, ")");

    const commaToken = this.getCurrentToken();

    if (commaToken.type === TokenType.Punctuation && commaToken.value === ",") {
      this.advance();
    }

    return new SummationOperand(number)
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
    BaseLexer.expectTokenType(token, TokenType.Number);
    return parseInt(token.value);
  }
}
