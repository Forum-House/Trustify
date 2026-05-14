const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  transpilePackages: ['@trustify/web3', '@trustify/config'],
  webpack: (config, { isServer }) => {
    // Force single instance of shared libraries
    config.resolve.alias = {
      ...config.resolve.alias,
      'wagmi': path.resolve(__dirname, 'node_modules/wagmi'),
      'viem': path.resolve(__dirname, 'node_modules/viem'),
      '@tanstack/react-query': path.resolve(__dirname, 'node_modules/@tanstack/react-query'),
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    };

    // Suppress warnings from third-party peer dependencies
    if (!isServer) {
      config.ignoreWarnings = [
        { module: /@metamask\/sdk/ },
        { module: /pino-pretty/ },
        { module: /ox/ },
      ];
    }
    return config;
  },
};
module.exports = nextConfig;
