/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Fallbacks for Node.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
      path: false,
      os: false,
    };

    // Externals
    config.externals.push('pino-pretty', 'lokijs', 'encoding');

    // Ignore problematic modules that cause build errors
    config.plugins.push(
      new (require('webpack').IgnorePlugin)({
        resourceRegExp: /@coinbase\/cdp-sdk/,
      })
    );
    
    config.plugins.push(
      new (require('webpack').IgnorePlugin)({
        resourceRegExp: /@base-org\/account/,
      })
    );

    return config;
  },
};

module.exports = nextConfig;
