const Emails = require('@sendgrid/mail');

Emails.setApiKey(process.env.SENDGRID_API_KEY);
module.exports = Emails;
