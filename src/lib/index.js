const os = require("os");
const path = require("path");
const ChiaConnection = require("./chia_connection");
const {
  ServiceNames,
  DefaultServicePorts,
  createChiaConnection,
} = require("./connection_factory");

let chiaRoot = null;

const getChiaRoot = () => {
  if (chiaRoot) {
    return chiaRoot;
  }

  if (process.env.CHIA_ROOT) {
    chiaRoot = path.resolve(process.env.CHIA_ROOT);
  } else {
    const homeDir = os.homedir();
    chiaRoot = path.resolve(`${homeDir}/.chia/mainnet`);
  }

  return chiaRoot;
};

__resetChiaRoot = () => {
  chiaRoot = null;
}; // for testing

module.exports = {
  getChiaRoot,
  createChiaConnection,
  ChiaConnection,
  ServiceNames,
  DefaultServicePorts,
  __resetChiaRoot,
};
