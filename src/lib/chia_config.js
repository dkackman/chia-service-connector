// adapted from https://github.com/Chia-Network/chia-blockchain-gui
const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const { getChiaRoot } = require("./get_chia_root");
const ChiaConnection = require("./chia_connection");

/**
 * Loads the daemon connection details from the default config's ui section.
 * @param {string} configFilePath - Optional full path to a chia config file
 * @returns Connection details.
 */
function getConnectionFromConfig(sectionName, configFilePath, defaultPortMap) {
    // fully resolve the config file path allowing it to be undefined
    // if undefined it will default to the chia root config file
    configFilePath =
        configFilePath ?? path.resolve(getChiaRoot(), "config/config.yaml");

    const config = readConfigFile(configFilePath);
    const configRootDir = path.dirname(configFilePath);

    // if it is the root section or the ui section it will be daemon connection
    // otherwise the section name corresponds to the service name
    const serviceName =
        sectionName === undefined || sectionName === "ui"
            ? "daemon"
            : sectionName;

    // the daemon section is a special case at the root of the document
    if (sectionName !== undefined && !sectionName.endsWith(".")) {
        sectionName = sectionName + ".";
    }
    const host = _.get(config, `${sectionName}daemon_host`, "localhost");
    const port = _.get(
        config,
        `${sectionName}daemon_port`,
        defaultPortMap[serviceName]
    );

    const certPath = path.resolve(
        configRootDir,
        _.get(
            config,
            `${sectionName}daemon_ssl.private_crt`,
            `config/ssl/${serviceName}/private_daemon.crt`
        )
    );
    const keyPath = path.resolve(
        configRootDir,
        _.get(
            config,
            `${sectionName}daemon_ssl.private_key`,
            `config/ssl/${serviceName}/private_daemon.key`
        )
    );

    return new ChiaConnection(serviceName, host, port, keyPath, certPath, 30);
}

function readConfigFile(configFilePath) {
    // respect the users config file path if provided or find it in the default location
    return yaml.load(fs.readFileSync(configFilePath, "utf8"));
}

module.exports = {
    getConnectionFromConfig,
};
