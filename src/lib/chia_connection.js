const fs = require("fs");
const os = require("os");

/**
 * Encapsulates the specific details needed to connect to a chia service.
 */
class ChiaConnection {
    /**
     *
     * @param {string} service - The service name - see ServiceNames
     * @param {string} host - The host (ip or hostname) of the chia service.
     * @param {number} port - The port of the chia service.
     * @param {string} key_path - The path to the key file for the service (can have ~).
     * @param {string} cert_path - The path to the cert file for the service (can have ~).
     * @param {number} timeout_seconds - The timeout in seconds for the connection.
     */
    constructor(service, host, port, key_path, cert_path, timeout_seconds) {
        this.service = service;
        this.host = host;
        this.port = port;
        this.key_path = key_path;
        this.cert_path = cert_path;
        this.timeout_seconds = timeout_seconds;
    }

    /**
     * @returns {object} The options for the WebSocket
     * or Https connection. This includes reading the
     * cert and key files from disk
     */
    createClientOptions(keepAlive = true) {
        return {
            rejectUnauthorized: false, // this is needed for the self signed certs
            keepAlive: keepAlive,
            key: this.key,
            cert: this.cert,
        };
    }

    /** formatted address */
    get serviceAddress() {
        if (this.service === "daemon") {
            return `wss://${this.host}:${this.port}`;
        }
        return `https://${this.host}:${this.port}`;
    }

    get key() {
        if (this._key === undefined) {
            this._key = fs.readFileSync(untildify(this.key_path));
        }

        return this._key;
    }

    get cert() {
        if (this._cert === undefined) {
            this._cert = fs.readFileSync(untildify(this.cert_path));
        }

        return this._cert;
    }
}
/**
 * Resolves paths like ~/.chia/mainnet to their fully qualified equivalent in a platform safe manner.
 * @param {string} pathWithTilde - A path that may or may not be rooted in the user's home folder.
 * @returns Fully qualified path, i.e. /home/user/.chia instead of ~/.chia.
 */
function untildify(pathWithTilde) {
    const homeDirectory = os.homedir();

    return homeDirectory
        ? pathWithTilde.replace(/^~(?=$|\/|\\)/, homeDirectory)
        : pathWithTilde;
}

module.exports = ChiaConnection;
