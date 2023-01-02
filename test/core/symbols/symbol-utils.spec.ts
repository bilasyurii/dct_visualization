import { expect } from "chai";
import { SymbolType } from "../../../src/core/symbols/symbol-type.enum";
import { SymbolUtils } from "../../../src/core/symbols/symbol-utils";

describe("SymbolUtils", function () {
  it("should return correct symbol type", function () {
    expect(SymbolUtils.getSymbolType("0")).to.be.equal(SymbolType.Numeric);
    expect(SymbolUtils.getSymbolType("6")).to.be.equal(SymbolType.Numeric);
    expect(SymbolUtils.getSymbolType("9")).to.be.equal(SymbolType.Numeric);

    expect(SymbolUtils.getSymbolType("a")).to.be.equal(SymbolType.Alphabetic);
    expect(SymbolUtils.getSymbolType("m")).to.be.equal(SymbolType.Alphabetic);
    expect(SymbolUtils.getSymbolType("x")).to.be.equal(SymbolType.Alphabetic);
    expect(SymbolUtils.getSymbolType("z")).to.be.equal(SymbolType.Alphabetic);

    expect(SymbolUtils.getSymbolType("A")).to.be.equal(SymbolType.Alphabetic);
    expect(SymbolUtils.getSymbolType("N")).to.be.equal(SymbolType.Alphabetic);
    expect(SymbolUtils.getSymbolType("X")).to.be.equal(SymbolType.Alphabetic);
    expect(SymbolUtils.getSymbolType("Z")).to.be.equal(SymbolType.Alphabetic);

    expect(SymbolUtils.getSymbolType(" ")).to.be.equal(SymbolType.Tabulation);
    expect(SymbolUtils.getSymbolType("\t")).to.be.equal(SymbolType.Tabulation);
    expect(SymbolUtils.getSymbolType("\n")).to.be.equal(SymbolType.Tabulation);

    expect(SymbolUtils.getSymbolType("{")).to.be.equal(SymbolType.Special);
    expect(SymbolUtils.getSymbolType("}")).to.be.equal(SymbolType.Special);
    expect(SymbolUtils.getSymbolType("(")).to.be.equal(SymbolType.Special);
    expect(SymbolUtils.getSymbolType(")")).to.be.equal(SymbolType.Special);
    expect(SymbolUtils.getSymbolType(",")).to.be.equal(SymbolType.Special);
    expect(SymbolUtils.getSymbolType("+")).to.be.equal(SymbolType.Special);
    expect(SymbolUtils.getSymbolType("-")).to.be.equal(SymbolType.Special);
    expect(SymbolUtils.getSymbolType(">")).to.be.equal(SymbolType.Special);
    expect(SymbolUtils.getSymbolType(".")).to.be.equal(SymbolType.Special);

    expect(SymbolUtils.getSymbolType("\b")).to.be.equal(SymbolType.Unknown);
    expect(SymbolUtils.getSymbolType("й")).to.be.equal(SymbolType.Unknown);
    expect(SymbolUtils.getSymbolType("=")).to.be.equal(SymbolType.Unknown);
    expect(SymbolUtils.getSymbolType("#")).to.be.equal(SymbolType.Unknown);
  });
});
