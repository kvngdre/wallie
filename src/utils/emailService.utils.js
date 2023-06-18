import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../config/index.js';
import Logger from './logger.utils.js';

const logger = new Logger();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

class EmailService {
  constructor() {
    this.transporter = null;
    this.#initialize();
  }

  // This function initializes the mailer object with the transporter and the handlebars template engine
  async #initialize() {
    try {
      const { clientId, clientSecret, refresh_token, email, oauthPlayground } =
        config.mailer;

      // Create a new OAuth2 client with the credentials
      const oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        oauthPlayground,
      );

      oauth2Client.setCredentials({ refresh_token });

      const accessToken = await oauth2Client.getAccessToken();

      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: email,
          clientId,
          clientSecret,
          refresh_token,
          accessToken,
        },
      });

      // Define the paths for the layouts and partials directories
      const layoutsPath = path.resolve(
        __dirname,
        '../asset/emailTemplates/layouts/',
      );
      const partialsPath = path.resolve(
        __dirname,
        '../asset/emailTemplates/partials/',
      );

      // Use the handlebars template engine for compiling the email body
      this.transporter.use(
        'compile',
        hbs({
          viewEngine: {
            extname: '.hbs',
            layoutsDir: layoutsPath,
            defaultLayout: '',
            partialsDir: partialsPath,
          },
          viewPath: layoutsPath,
          extName: '.hbs',
        }),
      );
    } catch (error) {
      logger.fatal(error.message, error.stack);

      throw error;
    }
  }

  /**
   * Sends an email with the given options
   * @async
   * @param {Object} options - The email options
   * @param {string} options.to - The recipient's email address
   * @param {string} options.subject - The email subject
   * @param {string} [options.template] - The handlebars template name for the email body
   * @param {Object} [options.context] - The context object for the template
   * @returns {Promise<Object>} A promise that resolves with an info object or rejects with an error object
   */
  sendMail = async (options) => {
    try {
      options.from = `"Wallie" <${config.mailer.email}>`;

      const info = await this.transporter.sendMail(options);

      return { info };
    } catch (error) {
      logger.error(error.message, error.stack);

      return { error };
    }
  };
}

export default EmailService;
