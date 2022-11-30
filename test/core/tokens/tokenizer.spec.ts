import { expect } from "chai";
import { Tokenizer } from "../../../src/core/tokens/tokenizer";
import { IToken } from "../../../src/core/tokens/token.interface";
import { TokenType } from "../../../src/core/tokens/token-type.enum";

const expectTokenToBeEqual = (actualToken: IToken, expectedType: TokenType, expectedValue: string) => {
  expect(actualToken.type).to.be.equal(expectedType);
  expect(actualToken.value).to.be.equal(expectedValue);
};

describe("Tokenizer", function () {
  let tokenizer: Tokenizer;

  beforeEach(() => {
    tokenizer = new Tokenizer();
  });

  it("should parse combination of numbers, punctuation and tabulation", function () {
    // arrange
    const input = "0 { 3,  2}";

    // act
    const tokens = tokenizer.tokenize(input);

    // assert
    expectTokenToBeEqual(tokens[0], TokenType.Number, "0");
    expectTokenToBeEqual(tokens[1], TokenType.Punctuation, "{");
    expectTokenToBeEqual(tokens[2], TokenType.Number, "3");
    expectTokenToBeEqual(tokens[3], TokenType.Punctuation, ",");
    expectTokenToBeEqual(tokens[4], TokenType.Number, "2");
    expectTokenToBeEqual(tokens[5], TokenType.Punctuation, "}");
  });

  it("should parse combination of arrow symbol, punctuation, numbers and tabulation", function () {
    // arrange
    const input = "->  ( +0)";

    // act
    const tokens = tokenizer.tokenize(input);

    // assert
    expectTokenToBeEqual(tokens[0], TokenType.Punctuation, "->");
    expectTokenToBeEqual(tokens[1], TokenType.Punctuation, "(");
    expectTokenToBeEqual(tokens[2], TokenType.Sign, "+");
    expectTokenToBeEqual(tokens[3], TokenType.Number, "0");
    expectTokenToBeEqual(tokens[4], TokenType.Punctuation, ")");
  });

  it("should parse combination of punctuation and text", function () {
    // arrange
    const input = "(X)";

    // act
    const tokens = tokenizer.tokenize(input);

    // assert
    expectTokenToBeEqual(tokens[0], TokenType.Punctuation, "(");
    expectTokenToBeEqual(tokens[1], TokenType.Text, "X");
    expectTokenToBeEqual(tokens[2], TokenType.Punctuation, ")");
  });

  it("should throw error when unknown symbol is met", function () {
    // arrange
    const input = "{*}";

    // act & assert
    expect(() => {
      tokenizer.tokenize(input);
    }).to.throw();
  });

  it("shouldn't throw errors when the composite token is met at the end of the string", function () {
    // arrange
    const input = "123";

    // act & assert
    expect(() => {
      tokenizer.tokenize(input)
    }).not.to.throw();
  });
});
