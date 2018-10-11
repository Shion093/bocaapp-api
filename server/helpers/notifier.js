const shortid = require('shortid');
const AWS = require('./aws');
const iot = new AWS.Iot();
const sts = new AWS.STS();
const roleName = 'NotifierRole';

function auth () {
  return new Promise((resolve, reject) => {
    iot.describeEndpoint({}, (err, data) => {
      if (err) return reject(err);

      const iotEndpoint = data.endpointAddress;
      const region = process.env.AWS_REGION;

      sts.getCallerIdentity({}, (err, data) => {
        console.log(data);
        if (err) return reject(err);

        const params = {
          RoleArn         : `arn:aws:iam::${data.Account}:role/${roleName}`,
          RoleSessionName : shortid.generate(),
        };

        sts.assumeRole(params, (err, data) => {
          if (err) return reject(err);

          const res = {
            iotEndpoint  : iotEndpoint,
            region       : region,
            accessKey    : data.Credentials.AccessKeyId,
            secretKey    : data.Credentials.SecretAccessKey,
            sessionToken : data.Credentials.SessionToken
          };

          return resolve(res);
        });
      });
    });
  })
}

module.exports = {
  auth,
};