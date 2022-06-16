module.exports = {
  webpackDevMiddleware: (config) => {
    // Actively poll change every 300 millisec
    // This proactively refresh file in container
    config.watchOptions.poll = 300;
    return config;
  },
};
