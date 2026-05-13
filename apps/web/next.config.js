/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@trustify/web3', '@trustify/config'],
  webpack: (config, { isServer }) => {
    // Suppress warnings from third-party peer dependencies
    if (!isServer) {
      config.ignoreWarnings = [
        // MetaMask SDK peer dependency (React Native only)
        { module: /@metamask\/sdk/ },
        // WalletConnect optional dependency
        { module: /pino-pretty/ },
        // Viem internal dynamic requires
        { module: /ox/ },
      ];
    }
    return config;
  },
};
module.exports = nextConfig;
