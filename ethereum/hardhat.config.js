/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("@nomiclabs/hardhat-ethers");
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/9c38c0f8900e4335a68282d4a29af940",
      accounts: {
        mnemonic:
          "hawk nephew cactus cement vague sample matrix face tragic spread mind much",
      },
    },
  },
};
