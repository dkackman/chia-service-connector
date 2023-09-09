import chai from "chai";
import {
    createChiaConnection,
    createChiaConnectionFromConfig,
    __resetChiaRoot,
} from "chia-service-connector";
import path from "path";
import { fileURLToPath } from "url";

/* jshint ignore:start */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
/* jshint ignore:end */

const expect = chai.expect;

describe("chia-service-connector", () => {
    describe("createChiaConnection", () => {
        it("should return env variable when passed undefined for root", () => {
            // arrange
            __resetChiaRoot();
            process.env.CHIA_ROOT = "CHIA_ROOT__TEST";
            const expected = path.resolve(process.env.CHIA_ROOT);

            // act
            const connection = createChiaConnection("daemon", "localhost");

            // assert
            expect(connection.key_path.startsWith(expected)).to.equal(true);

            // cleanup
            delete process.env.CHIA_ROOT;
            __resetChiaRoot();
        });
        it("should respected root argument", () => {
            // arrange
            __resetChiaRoot();
            delete process.env.CHIA_ROOT;
            const expected = path.resolve("___TEST___");

            // act
            const connection = createChiaConnection(
                "daemon",
                "localhost",
                expected
            );

            // assert
            expect(connection.key_path.startsWith(expected)).to.equal(true);

            // cleanup
            __resetChiaRoot();
        });
    });
    describe("createChiaConnectionFromConfig", () => {
        it("should find the getChiaRoot config by default", () => {
            // arrange
            __resetChiaRoot();
            process.env.CHIA_ROOT = path.resolve(`${__dirname}/test_data`);
            const expected = ""; //path.resolve(process.env.CHIA_ROOT);

            // act
            const connection = createChiaConnectionFromConfig("ui");

            // assert
            expect(connection.key_path.startsWith(expected)).to.equal(true);

            // cleanup
            delete process.env.CHIA_ROOT;
            __resetChiaRoot();
        });
        it("should find the user supplied config even if environment var is set", () => {
            // arrange
            __resetChiaRoot();
            process.env.CHIA_ROOT = path.resolve(`___BAD___`);
            const expected = path.resolve(
                `${__dirname}/test_data/config/config.yaml`
            );

            // act
            const connection = createChiaConnectionFromConfig("ui", expected);
            const key = connection.key;
            const cert = connection.cert;

            // assert
            expect(key.toString()).to.equal("___TEST___");
            expect(cert.toString()).to.equal("___TEST___");

            // cleanup
            delete process.env.CHIA_ROOT;
            __resetChiaRoot();
        });
        it("should find the root daemon section", () => {
            // arrange
            const configFilePath = path.resolve(
                `${__dirname}/test_data/config/config.yaml`
            );

            // act
            const connection = createChiaConnectionFromConfig(
                "daemon",
                configFilePath
            );
            const key = connection.key;
            const cert = connection.cert;

            // assert
            expect(key.toString()).to.equal("___TEST___");
            expect(cert.toString()).to.equal("___TEST___");

            // cleanup
        });
        it("should find the wallet section", () => {
            // arrange
            const configFilePath = path.resolve(
                `${__dirname}/test_data/config/config.yaml`
            );

            // act
            const connection = createChiaConnectionFromConfig(
                "wallet",
                configFilePath
            );
            const key = connection.key;
            const cert = connection.cert;

            // assert
            expect(key.toString()).to.equal("___TEST___");
            expect(cert.toString()).to.equal("___TEST___");

            // cleanup
        });
    });
});
