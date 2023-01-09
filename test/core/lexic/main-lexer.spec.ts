import { expect } from "chai";
import { IToken } from "../../../src/core/tokens/token.interface";
import { TokenType } from "../../../src/core/tokens/token-type.enum";
import { MainLexer } from "../../../src/core/lexic/main-lexer";
import { WrapLexer } from "../../../src/core/lexic/wrap-lexer";
import { LexicalTree } from "../../../src/core/lexic/structures/lexical-tree";
import { HierarchyLexer } from "../../../src/core/lexic/hierarchy-lexer";

describe("MainLexer", function () {
  it("should correctly process a new advanced data format", function () {
    // arrange
    const wrapLexer = new WrapLexer(true);
    const hierarchyLexer = new HierarchyLexer();
    const mainLexer = new MainLexer(wrapLexer, hierarchyLexer);

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

    let lexicalTree: LexicalTree;

    // act
    lexicalTree = mainLexer.parse(input);

    // assert
    expect(lexicalTree).to.exist;

    const superWraps = lexicalTree.getSuperWraps();
    expect(superWraps).to.exist;
    expect(superWraps).to.be.an("array");
    expect(Array.isArray(superWraps)).to.be.true;
    expect(superWraps).to.have.length(1);

    const superWrap = superWraps[0];
    expect(superWrap).to.exist;

    const wraps = superWrap.getWraps();
    expect(wraps).to.exist;
    expect(wraps).to.be.an("array");
    expect(Array.isArray(wraps)).to.be.true;
    expect(wraps).to.have.length(2);
  });
});
