const mailer = require("nodemailer");

// Use Smtp Protocol to send Email
const Emails = mailer.createTransport("SMTP",{
                            service: "Gmail",
                            auth: {
                                user: "clouddevelop2019@gmail.com",
                                pass: process.ENV.MAIL_PASSWORD
                            }
});

module.exports = Emails;
