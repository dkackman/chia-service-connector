import chai from "chai";
import { ChiaConnection } from "chia-service-connector";
import path from "path";
import { fileURLToPath } from "url";

/* jshint ignore:start */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
/* jshint ignore:end */
const expect = chai.expect;

describe("chia-service-connector", () => {
  describe("ChiaConnection", () => {
    it("should resolve cert files", () => {
      // arrange
      const chia_root = path.resolve(`${__dirname}/test_data`);
      const connection = new ChiaConnection(
        "daemon",
        "localhost",
        55400,
        `${chia_root}/config/ssl/daemon/private_daemon.key`,
        `${chia_root}/config/ssl/daemon/private_daemon.crt`,
        10
      );

      // act
      const key = connection.key;
      const cert = connection.cert;

      // assert
      expect(key.toString()).to.equal("___TEST___");
      expect(cert.toString()).to.equal("___TEST___");
    });
  });
});
