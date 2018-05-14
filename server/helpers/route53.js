const _ = require('lodash');

const aws = require('./aws');
const { restaurant } = require('../config/constants');

const Route53 = new aws.Route53();

function getDomainParams (zoneId, url, method) {
  return {
    HostedZoneId : zoneId,
    ChangeBatch  : {
      Changes : [
        {
          Action            : method, // CREATE, UPSERT, DELETE
          ResourceRecordSet : {
            Name            : url,
            Type            : 'CNAME',
            TTL             : 300,
            ResourceRecords : [
              {
                Value : restaurant,
              }
            ]
          }
        }
      ]
    }
  };
}

async function checkDomain (id, url) {
  const { ResourceRecordSets } = await Route53.listResourceRecordSets({ HostedZoneId : id }).promise();
  return _.find(ResourceRecordSets, { 'Name' : `${url}.` });
}

async function createDomain (url) {
  const { HostedZones } = await Route53.listHostedZones().promise();
  const urlExists = await checkDomain(HostedZones[0].Id, url);
  if (urlExists) {
    throw new Error('URL already exists');
  }
  const params = getDomainParams(HostedZones[0].Id, url, 'CREATE');
  return Route53.changeResourceRecordSets(params).promise();
}

module.exports = {
  createDomain,
};
