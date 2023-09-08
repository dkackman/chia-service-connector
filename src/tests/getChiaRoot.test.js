import chai from "chai";
import { getChiaRoot, __resetChiaRoot } from "chia-service-connector";
import path from "path";
import os from "os";

const expect = chai.expect;

describe("chia-service-connector", () => {
  describe("getChiaRoot", () => {
    it("should return default path when CHIA_ROOT not set", () => {
      // arrange
      __resetChiaRoot();
      delete process.env.CHIA_ROOT;
      const expected = path.resolve(`${os.homedir()}/.chia/mainnet`);

      // act
      const chiaRoot = getChiaRoot();

      // assert
      expect(chiaRoot).to.equal(expected);
    });
    it("should return CHIA_ROOT when set", () => {
      // arrange
      __resetChiaRoot();
      process.env.CHIA_ROOT = "CHIA_ROOT__TEST";
      const expected = path.resolve(process.env.CHIA_ROOT);

      // act
      const chiaRoot = getChiaRoot();

      // assert
      expect(chiaRoot).to.equal(expected);

      // cleanup
      delete process.env.CHIA_ROOT;
    });
  });
});
