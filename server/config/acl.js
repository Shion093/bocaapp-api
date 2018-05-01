const Acl = require('acl');
const aclStore = require('../helpers/aclStore');

const MongodbBackend = Acl.mongodbBackend;

async function initAcl (dbConnection) {
  const backend = new MongodbBackend(dbConnection, 'acl_');
  const acl = new Acl(backend);
  acl.allow([
    {
      roles: 'admin',
      allows: [
        { resources: '/api/adminonly', permissions: '*' }
      ]
    },
    {
      roles: 'user',
      allows: []
    }
  ]);
  aclStore.acl = acl;
}

module.exports = initAcl;