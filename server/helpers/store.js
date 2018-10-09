const Store = require('../api/store/model');

async function isStoreOpen (_id) {
  const result = await Store.findOne({ _id });
  return result ? result.isOpen : null;
}

module.exports = {
  isStoreOpen,
};