import { expect } from "chai";
import { IToken } from "../../../src/core/tokens/token.interface";
import { TokenType } from "../../../src/core/tokens/token-type.enum";
import { Hierarchy, HierarchyLexer } from "../../../src/core/lexic/hierarchy-lexer";

describe("HierarchyLexer", function () {
  it("should correctly process a numeric-alphabetic hierarchy data format", function () {
    // arrange
    const hierarchyLexer = new HierarchyLexer();

    // "2.    a) ( +1) (X) { +(x(0)) }\n    b) ( +5) (X) { +x(2)  -x(12)}\n"
    const input: IToken[] = [
      {
        type: TokenType.Number,
        value: "2",
      },
      {
        type: TokenType.Punctuation,
        value: ".",
      },
      {
        type: TokenType.Text,
        value: "a",
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
        type: TokenType.Sign,
        value: "+",
      },
      {
        type: TokenType.Number,
        value: "1",
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
      {
        type: TokenType.Sign,
        value: "+",
      },
      {
        type: TokenType.Punctuation,
        value: "(",
      },
      {
        type: TokenType.Text,
        value: "x",
      },
      {
        type: TokenType.Punctuation,
        value: "(",
      },
      {
        type: TokenType.Number,
        value: "0",
      },
      {
        type: TokenType.Punctuation,
        value: ")",
      },
      {
        type: TokenType.Punctuation,
        value: ")",
      },
      {
        type: TokenType.Punctuation,
        value: "}",
      },
      {
        type: TokenType.NewLine,
        value: "\n",
      },
      {
        type: TokenType.Text,
        value: "b",
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
        type: TokenType.Sign,
        value: "+",
      },
      {
        type: TokenType.Number,
        value: "5",
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
      {
        type: TokenType.Sign,
        value: "+",
      },
      {
        type: TokenType.Text,
        value: "x",
      },
      {
        type: TokenType.Punctuation,
        value: "(",
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
        type: TokenType.Sign,
        value: "-",
      },
      {
        type: TokenType.Text,
        value: "x",
      },
      {
        type: TokenType.Punctuation,
        value: "(",
      },
      {
        type: TokenType.Number,
        value: "12",
      },
      {
        type: TokenType.Punctuation,
        value: ")",
      },
      {
        type: TokenType.Punctuation,
        value: "}",
      },
    ];

    let hierarchy: Hierarchy;

    // act
    hierarchy = hierarchyLexer.parse(input);

    // assert
    expect(hierarchy).to.exist;
    expect(hierarchy).to.have.length(1);

    const numericItem = hierarchy[0];
    expect(numericItem).to.exist;

    expect(numericItem.getKey()).to.equal(2);

    const alphabeticList = numericItem.getValue();
    expect(alphabeticList).to.exist;
    expect(alphabeticList).to.be.an("array");
    expect(Array.isArray(alphabeticList)).to.be.true;
    expect(alphabeticList).to.have.length(2);

    const alphabeticItem0 = alphabeticList[0];
    expect(alphabeticItem0).to.exist;
    expect(alphabeticItem0.getKey()).to.equal("a");
    expect(alphabeticItem0.getValue()).to.exist;
    expect(alphabeticItem0.getValue()).to.be.an("array");
    expect(Array.isArray(alphabeticItem0.getValue())).to.be.true;
    expect(alphabeticItem0.getValue()).deep.be.equal(input.slice(4, 21));

    const alphabeticItem1 = alphabeticList[1];
    expect(alphabeticItem1).to.exist;
    expect(alphabeticItem1.getKey()).to.equal("b");
    expect(alphabeticItem1.getValue()).to.exist;
    expect(alphabeticItem1.getValue()).to.be.an("array");
    expect(Array.isArray(alphabeticItem1.getValue())).to.be.true;
    expect(alphabeticItem1.getValue()).deep.be.equal(input.slice(23));
  });
});
