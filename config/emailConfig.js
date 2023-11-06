const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "235d4fbf890151",
      pass: "239a58f61ee725"
    }
  });

module.exports = transport;





