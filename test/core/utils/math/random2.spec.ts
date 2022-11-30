import { expect } from "chai";
import { Random2 } from "../../../../src/core/utils/math/random2";

describe("Random2", function () {
  it("should produce appropriate value type when integer is requested", function () {
    expect(new Random2().int() % 1).to.be.equal(0);
  });

  it("should produce appropriate value type when float is requested", function () {
    expect(new Random2().float() % 1).not.to.be.equal(0);
  });

  it("should produce appropriate value type when bool is requested", function () {
    expect(new Random2().boolean()).to.be.a('boolean');
  });

  it("should produce float value in a specified range", function () {
    const min = 2.5;
    const max = 7.3;
    expect(new Random2().floatBetween(min, max)).to.be.greaterThanOrEqual(min).and.to.be.lessThan(max);
  });

  it("should produce integer value in a specified range", function () {
    const min = 2;
    const max = 7;
    expect(new Random2().intBetween(min, max)).to.be.greaterThanOrEqual(min).and.to.be.lessThan(max);
  });

  it("should produce different values in separate calls", function () {
    const random = new Random2();
    let duplicatesCount = 0;
    let prevValue = null;

    for (let i = 0; i < 10; ++i) {
      const value = random.int();

      if (value === prevValue) {
        ++duplicatesCount;
      }

      prevValue = value;
    }

    expect(duplicatesCount).to.be.lessThanOrEqual(1);
  });

  it("should produce same values for the same seeds", function () {
    const seed = 424242;
    const random1 = new Random2(seed);
    const random2 = new Random2(seed);

    for (let i = 0; i < 10; ++i) {
      expect(random1.int()).to.be.equal(random2.int());
    }
  });
});
