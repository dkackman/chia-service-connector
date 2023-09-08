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
export default function loadUIConfig(configFilePath) {
    const config = readConfigFile(configFilePath);

    const selfHostname = _.get(config, "ui.daemon_host", "localhost");
    const daemonPort = _.get(config, "ui.daemon_port", 55400);

    const configRootDir = getChiaRoot();

    const certPath = path.resolve(
        configRootDir,
        _.get(
            config,
            "ui.daemon_ssl.private_crt",
            "config/ssl/daemon/private_daemon.crt"
        )
    );
    const keyPath = path.resolve(
        configRootDir,
        _.get(
            config,
            "ui.daemon_ssl.private_key",
            "config/ssl/daemon/private_daemon.key"
        )
    );

    return new ChiaConnection(
        "daemon",
        selfHostname,
        daemonPort,
        keyPath,
        certPath,
        30
    );
}

function readConfigFile(configFilePath) {
    // respect the users config file path if provided or find it in the default location
    configFilePath ?? path.resolve(getChiaRoot(), "config/config.yaml");

    return yaml.load(fs.readFileSync(configFilePath, "utf8"));
}
