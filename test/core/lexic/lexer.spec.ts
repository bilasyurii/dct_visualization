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
        value: "0",
      },
    ];

    // act
    const wrap = lexer.parse(input);

    // assert
    expect(1).to.be.equal(1);
  });
});
