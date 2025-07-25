/**
 * Next.js configuration helper to suppress swagger-ui-react warnings
 * Add this to your next.config.js file
 */

function withSwaggerSupport(nextConfig = {}) {
  return {
    ...nextConfig,
    webpack: (config, options) => {
      // Suppress specific warnings from swagger-ui-react
      if (!config.ignoreWarnings) {
        config.ignoreWarnings = [];
      }

      config.ignoreWarnings.push(
        /UNSAFE_componentWillReceiveProps/,
        /componentWillReceiveProps/,
        /OperationContainer/
      );

      // Call the existing webpack function if it exists
      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
    // Suppress React strict mode warnings in development
    compiler: {
      ...nextConfig.compiler,
      reactRemoveProperties: process.env.NODE_ENV === "production",
    },
  };
}

module.exports = { withSwaggerSupport };
