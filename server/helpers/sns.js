const aws = require('./aws');

const SNS = new aws.SNS();

function setSMSAttributes () {
  return SNS.setSMSAttributes(
    {
      attributes : {
        DefaultSMSType : 'Transactional',
      }
    }
  ).promise();
}

async function sendSMS ({ phone, message }) {
  const params = {
    Message     : message,
    PhoneNumber : phone,
  };
  const sms = await SNS.publish(params).promise();
  console.log(sms);
  return sms;

}

module.exports = {
  sendSMS,
};