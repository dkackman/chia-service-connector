const { getChiaRoot } = require("./get_chia_root");
const { getConnectionFromConfig } = require("./chia_config");
const ChiaConnection = require("./chia_connection");
const path = require("path");

ServiceNames = {
    Daemon: "daemon",
    FullNode: "full_node",
    Wallet: "wallet",
    Farmer: "farmer",
    Harvester: "harvester",
    Crawler: "crawler",
    DataLayer: "data_layer",
};

/**
 * The default ports for the services. (https://docs.chia.net/rpc)
 */
const DefaultServicePorts = {
    daemon: 55400,
    full_node: 8555,
    wallet: 9256,
    farmer: 8559,
    harvester: 8560,
    crawler: 8561,
    data_layer: 8562,
};

/**
 * Creates a connection to a service.
 * @param {string} serviceName - The service for the command. One of the ServiceNames constants.
 * @param {string} host - The host (ip or hostname) of the chia service.
 * @param {string} root - The path to the chia root directory. (can also be a path to the ssl directory)
 * @param {number} timeoutSeconds - The timeout in seconds for the connection.
 * @param {object} portMap - The port map for the services. Defaults to DefaultServicePorts.
 * @returns {ChiaConnection} The connection object
 */
function createChiaConnection(
    serviceName,
    host = "localhost",
    root = getChiaRoot(), // defaults to env variable or ~/.chia/mainnet
    timeoutSeconds = 30,
    portMap = DefaultServicePorts
) {
    // if the root isn't an ssl path, assume it's the
    // chia root and append the ssl path
    if (!root.endsWith("/config/ssl")) {
        root = `${root}/config/ssl`;
    }

    return new ChiaConnection(
        serviceName,
        host,
        portMap[serviceName],
        `${root}/${serviceName}/private_${serviceName}.key`,
        `${root}/${serviceName}/private_${serviceName}.crt`,
        timeoutSeconds
    );
}

/**
 * Loads th  connection details from a config file
 * @param {string} sectionName - The config section name to load. (Will be a ServiceName or "ui")
 * @param {string} configFilePath - Optional full path to a chia config file - will default to getChiaRoot
 * @returns Connection details.
 */
function createChiaConnectionFromConfig(
    sectionName,
    configFilePath = path.resolve(`${getChiaRoot()}/config/config.yaml`)
) {
    if (
        sectionName !== "ui" &&
        sectionName !== "daemon" &&
        !(sectionName in ServiceNames)
    ) {
        throw new Error(`Invalid section name: ${sectionName}`);
    }

    if (sectionName === ServiceNames.Daemon) {
        // pass undefined because the daemon configuration is at the document root
        sectionName = undefined;
    }

    return getConnectionFromConfig(sectionName, configFilePath);
}

module.exports = {
    ServiceNames,
    DefaultServicePorts,
    createChiaConnection,
    createChiaConnectionFromConfig,
};
