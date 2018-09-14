const accountSid = 'ACd2f54b22fa85f3c4c34e3801e8ad5938';
const authToken = '8076cf48001ff1776f34cb5087077962';
const twilioNumber = '+18652902477';
const client = require('twilio')(accountSid, authToken);


function sendSMS ({ phone, message }) {
  return client.messages.create({
    body : message,
    from : twilioNumber,
    to   : phone,
  });
}

module.exports = {
  sendSMS,
};
