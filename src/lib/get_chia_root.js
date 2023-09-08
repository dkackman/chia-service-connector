const os = require("os");
const path = require("path");

let chiaRoot = null;

const getChiaRoot = () => {
  if (chiaRoot) {
    return chiaRoot;
  }

  if (process.env.CHIA_ROOT) {
    chiaRoot = path.resolve(process.env.CHIA_ROOT);
  } else {
    chiaRoot = path.resolve(`${os.homedir()}/.chia/mainnet`);
  }

  return chiaRoot;
};

__resetChiaRoot = () => {
  chiaRoot = undefined;
}; // for testing

module.exports = {
  getChiaRoot,
  __resetChiaRoot,
};
