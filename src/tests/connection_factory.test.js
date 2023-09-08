import chai from "chai";
import { createChiaConnection, __resetChiaRoot } from "chia-service-connector";
import path from "path";

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
});
