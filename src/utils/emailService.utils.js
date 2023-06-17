import nodemailer from 'nodemailer';
import config from '../config/index.js';
import Logger from './logger.utils.js';

const logger = new Logger();

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.mail.email,
    pass: config.mail.password,
  },
});

/** @type {nodemailer.SendMailOptions} */
const mailOptions = {
  from: `Wallie <${config.mail.email}>`,
  to: 'kennedydre3@gmail.com',
  Subject: 'Welcome',
  text: 'Ping and Testing',
};

try {
  const info = await transport.sendMail(mailOptions);

  console.log(info);
} catch (error) {
  console.log(error);
}
