const mongoose = require('mongoose');
const aclConfig = require('./acl');
const aclStore = require('../helpers/aclStore');
const { env, mongo } = require('./constants');

mongoose.Promise = Promise;

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

mongoose.connection.once('open', () => {
  aclConfig(mongoose.connection.db);
  console.log(aclStore);
});

if (env === 'development') {
  mongoose.set('debug', true);
}

module.exports.connect = () => {
  mongoose.connect(mongo.uri, {
    keepAlive: 1,
  });

  return mongoose.connection;
};
