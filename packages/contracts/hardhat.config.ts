import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env" });
dotenv.config({ path: "./.env" });

const amoyRpc = process.env.POLYGON_AMOY_RPC_URL ?? "https://rpc-amoy.polygon.technology";
const polygonRpc = process.env.POLYGON_RPC_URL ?? "https://polygon-rpc.com";
const deployerPk = process.env.DEPLOYER_PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      viaIR: true
    }
  },
  networks: {
    hardhat: {},
    localhost: { url: "http://127.0.0.1:8545", chainId: 31337 },
    amoy: { url: amoyRpc, chainId: 80002, accounts: deployerPk ? [deployerPk] : [] },
    polygon: { url: polygonRpc, chainId: 137, accounts: deployerPk ? [deployerPk] : [] }
  },
  etherscan: {
    apiKey: {
      polygonAmoy: process.env.POLYGONSCAN_API_KEY ?? "",
      polygon: process.env.POLYGONSCAN_API_KEY ?? ""
    }
  }
};

export default config;
