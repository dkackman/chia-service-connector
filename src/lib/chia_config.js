const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const { getChiaRoot } = require("./get_chia_root");
const ChiaConnection = require("./chia_connection");

/**
 * Loads the connection details from the a config section.
 * @param {string} sectionName - The section name in the config file - undefined for root
 * @param {string} configFilePath - Optional full path to a chia config file - defaults to getChiaRoot
 * @returns Connection details.
 */
function getConnectionFromConfig(sectionName, configFilePath) {
    // fully resolve the config file path allowing it to be undefined
    // if undefined it will default to the chia root config file
    configFilePath =
        configFilePath ?? path.resolve(getChiaRoot(), "config/config.yaml");

    const config = readConfigFile(configFilePath);
    const configParentDir = path.dirname(path.dirname(configFilePath));

    // these apply for everything but the daemon and ui
    let serviceName = sectionName;
    let port = _.get(config, `${serviceName}.rpc_port`, 0);
    let host = config.self_hostname;
    let certPath = _.get(config, `${serviceName}.ssl.private_crt`);
    let keyPath = _.get(config, `${serviceName}.ssl.private_key`);

    // there are two daemon configs
    // 1) the root daemon config
    // 2) the ui daemon config
    if (sectionName === undefined) {
        serviceName = "daemon";
        port = config.daemon_port;
        certPath = config.daemon_ssl.private_crt;
        keyPath = config.daemon_ssl.private_key;
    } else if (sectionName === "ui") {
        serviceName = "daemon";
        host = config.ui.daemon_host;
        port = config.ui.daemon_port;
        certPath = config.ui.daemon_ssl.private_crt;
        keyPath = config.ui.daemon_ssl.private_key;
    }

    return new ChiaConnection(
        serviceName,
        host,
        port,
        path.resolve(configParentDir, keyPath),
        path.resolve(configParentDir, certPath),
        30
    );
}

function readConfigFile(configFilePath) {
    // respect the users config file path if provided or find it in the default location
    return yaml.load(fs.readFileSync(configFilePath, "utf8"));
}

module.exports = {
    getConnectionFromConfig,
};
