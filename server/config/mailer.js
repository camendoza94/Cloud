const Emails = require('@sendgrid/mail');

Emails.setApiKey(process.env.SENDGRID_API_KEY);

// Function to send mail 'to'
exports.sendEmail = (to) => {
    const mail = {
        from: 'clouddevelop2019@gmail.com',
        to: to,
        subject: 'Available contests voice',
        text: 'Hi there, this email was automatically sent by us to tell you that your voice is now available for a new audio contest',
        html: 'Hi there, this email was automatically sent by us to tell you that your voice is know available for a new <b>audio contest</b>'
      };
      console.log(mail);
      Emails.send(mail);
};
