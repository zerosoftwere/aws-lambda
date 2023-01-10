const getQuotes = require('./handlers/getQuotes');
const getSubscribers = require('./handlers/getSubscribers');
const sendEmail = require('./handlers/sendEmail');
const staticMailer = require('./handlers/staticMailer');
const subscribeUser = require('./handlers/subscribeUser');

module.exports = {
  getQuotes,
  subscribeUser,
  getSubscribers,
  staticMailer,
  sendEmail,
};
