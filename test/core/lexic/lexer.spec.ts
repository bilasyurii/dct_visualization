import { expect } from "chai";
import { IToken } from "../../../src/core/tokens/token.interface";
import { TokenType } from "../../../src/core/tokens/token-type.enum";
import { Lexer } from "../../../src/core/lexic/lexer";
import { Wrap } from "../../../src/core/lexic/structures/wrap";

describe("Lexer", function () {
  let lexer: Lexer;

  beforeEach(() => {
    lexer = new Lexer();
  });

  it("should correctly form a wrap", function () {
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
        value: "-",
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
        value: "3",
      },
      {
        type: TokenType.Punctuation,
        value: ")",
      },
      {
        type: TokenType.Punctuation,
        value: ",",
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
        value: "5",
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
    ];

    let wrap: Wrap;

    // act
    wrap = lexer.parse(input);

    // assert
    expect(wrap).to.exist;

    (() => {
      const scaledPointSet = wrap.getScaledPointSet();
      expect(scaledPointSet).to.exist;
  
      const scaledPoints = scaledPointSet.getScaledPoints();
      expect(scaledPoints).to.exist;
      expect(scaledPoints).to.be.an("array");
      expect(Array.isArray(scaledPoints)).to.be.true;
      expect(scaledPoints).to.have.length(1);
  
      const scaledPoint = scaledPoints[0];
      expect(scaledPoint).to.exist;
  
      const signedNumber = scaledPoint.getSignedNumber();
      expect(signedNumber).to.exist;
      expect(signedNumber.isPositive()).to.be.true;
      expect(signedNumber.getAbsoluteValue()).to.be.equal(1);
  
      const point = scaledPoint.getPoint();
      expect(point).to.exist;
      expect(point.getX()).to.be.equal(1);
      expect(point.getY()).to.be.equal(0);
    })();

    (() => {
      const sumSet = wrap.getSumSet();
      expect(sumSet).to.exist;
  
      const signedNumbers = sumSet.getSignedNumbers();
      expect(signedNumbers).to.exist;
      expect(signedNumbers).to.be.an("array");
      expect(Array.isArray(signedNumbers)).to.be.true;
      expect(signedNumbers).to.have.length(1);
  
      const signedNumber = signedNumbers[0];
      expect(signedNumber).to.exist;
      expect(signedNumber.isNegative()).to.be.true;
      expect(signedNumber.getAbsoluteValue()).to.be.equal(2);
    })();

    (() => {
      const summationSet = wrap.getSummationSet();
      expect(summationSet).to.exist;
  
      const summationOperandSets = summationSet.getSummationOperandSets();
      expect(summationOperandSets).to.exist;
      expect(summationOperandSets).to.be.an("array");
      expect(Array.isArray(summationOperandSets)).to.be.true;
      expect(summationOperandSets).to.have.length(1);
  
      const summationOperandSet = summationOperandSets[0];
      expect(summationOperandSet).to.exist;
      expect(summationOperandSet.isPositive()).to.be.true;

      const summationOperands = summationOperandSet.getSummationOperands();
      expect(summationOperands).to.exist;
      expect(summationOperands).to.be.an("array");
      expect(Array.isArray(summationOperands)).to.be.true;
      expect(summationOperands).to.have.length(2);

      expect(summationOperands[0]).to.exist;
      expect(summationOperands[0].getValue()).to.be.equal(3);

      expect(summationOperands[1]).to.exist;
      expect(summationOperands[1].getValue()).to.be.equal(5);
    })();
  });
});
