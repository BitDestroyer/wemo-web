var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'wemo'
    },
    port: 3000,
    db: 'mongodb://localhost/wemo-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'wemo'
    },
    port: 3000,
    db: 'mongodb://localhost/wemo-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'wemo'
    },
    port: 3000,
    db: 'mongodb://localhost/wemo-production'
  }
};

module.exports = config[env];
