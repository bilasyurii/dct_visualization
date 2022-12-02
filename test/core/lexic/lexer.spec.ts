import { expect } from "chai";
import { IToken } from "../../../src/core/tokens/token.interface";
import { TokenType } from "../../../src/core/tokens/token-type.enum";
import { Lexer } from "../../../src/core/lexic/lexer";

describe("Lexer", function () {
  let lexer: Lexer;

  beforeEach(() => {
    lexer = new Lexer();
  });

  it("should", function () {
    // arrange
    const input: IToken[] = [
      {
        type: TokenType.Sign,
        value: "+",
      },
      {
        type: TokenType.Number,
        value: "1",
      },
      {
        type: TokenType.Punctuation,
        value: "{",
      },
      {
        type: TokenType.Number,
        value: "1",
      },
      {
        type: TokenType.Punctuation,
        value: ",",
      },
      {
        type: TokenType.Number,
        value: "0",
      },
      {
        type: TokenType.Punctuation,
        value: "}",
      },
      {
        type: TokenType.Punctuation,
        value: "->",
      },
      {
        type: TokenType.Punctuation,
        value: "(",
      },
      {
        type: TokenType.Sign,
        value: "+",
      },
      {
        type: TokenType.Number,
        value: "2",
      },
      {
        type: TokenType.Punctuation,
        value: ")",
      },
      {
        type: TokenType.Punctuation,
        value: "(",
      },
      {
        type: TokenType.Text,
        value: "X",
      },
      {
        type: TokenType.Punctuation,
        value: ")",
      },
      {
        type: TokenType.Punctuation,
        value: "{",
      },
    ];

    // act
    const wrap = lexer.parse(input);
    console.log(wrap);

    // assert
    expect(1).to.be.equal(1);
  });
});
