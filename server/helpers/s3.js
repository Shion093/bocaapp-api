const aws = require('./aws');

const S3 = new aws.S3();

function uploadS3 ({ bucket, fileName, data }) {
  return new Promise((resolve, reject) => {
    S3.upload({
      Bucket          : bucket,
      Key             : fileName,
      Body            : data,
      ACL             : 'public-read',
      ContentEncoding : 'base64',
    }, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}

module.exports = uploadS3;