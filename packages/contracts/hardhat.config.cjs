const jiti = require("jiti")(__filename);
const { CHAIN_CONFIG } = jiti("../config/src/index.ts");

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: "../../.env" });
require("dotenv").config({ path: "./.env" });

const deployerPk = process.env.DEPLOYER_PRIVATE_KEY;

const config = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      viaIR: true
    }
  },
  networks: {
    hardhat: {},
    localhost: { 
      url: CHAIN_CONFIG.localhost.rpcUrl, 
      chainId: CHAIN_CONFIG.localhost.chainId 
    },
    amoy: { 
      url: process.env.POLYGON_AMOY_RPC_URL || CHAIN_CONFIG.amoy.rpcUrl, 
      chainId: CHAIN_CONFIG.amoy.chainId, 
      accounts: deployerPk ? [deployerPk] : [] 
    },
    polygon: { 
      url: process.env.POLYGON_RPC_URL || CHAIN_CONFIG.polygon.rpcUrl, 
      chainId: CHAIN_CONFIG.polygon.chainId, 
      accounts: deployerPk ? [deployerPk] : [] 
    }
  },
  etherscan: {
    apiKey: {
      polygonAmoy: process.env.POLYGONSCAN_API_KEY || "",
      polygon: process.env.POLYGONSCAN_API_KEY || ""
    }
  }
};

module.exports = config;
