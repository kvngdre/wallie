import { addColors, createLogger, format, transports } from 'winston';
import isDevEnvironment from './isDevEnvironment.utils.js';

const { align, cli, colorize, combine, printf, timestamp } = format;

const customLevels = {
  colors: {
    fatal: 'red',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'magenta',
    silly: 'cyan',
  },
  levels: { fatal: 0, error: 1, warn: 2, info: 3, debug: 4, silly: 5 },
};

const devFormatter = combine(
  cli(),
  colorize(),
  timestamp({ format: 'HH:mm:ss' }),
  printf(({ timestamp, level, message, meta }) => {
    return `[${level}]${timestamp} ${message} ${
      meta ? `${JSON.stringify(meta, null, 2)}` : ''
    }`;
  }),
);

const prodFormatter = combine(
  align(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  printf(({ level, timestamp, message, meta }) => {
    return `[${level}]${timestamp} ${message} ${
      meta ? JSON.stringify(meta, null, 2) : ''
    }`;
  }),
);

class Logger {
  constructor() {
    const devTransport = new transports.Console({
      format: devFormatter,
    });

    const prodTransport = new transports.File({
      level: 'error',
      filename: 'src/logs/error.log',
      format: prodFormatter,
      json: true,
    });

    this.logger = createLogger({
      level: isDevEnvironment() ? 'silly' : 'error',
      levels: customLevels.levels,
      transports: [isDevEnvironment() ? devTransport : prodTransport],
    });

    addColors(customLevels.colors);
  }

  /**
   * Log with log level fatal
   * @param {string} message
   * @param {*} meta
   */
  fatal(message, meta) {
    this.logger.log('fatal', { message, meta });
  }

  /**
   * Log with log level error
   * @param {string} message
   * @param {*} meta
   */
  error(message, meta) {
    this.logger.error({ message, meta });
  }

  /**
   * Log with log level warn
   * @param {string} message
   * @param {*} meta
   */
  warn(message, meta) {
    this.logger.warn({ message, meta });
  }

  /**
   * Log with log level info
   * @param {string} message
   * @param {*} meta
   */
  info(message, meta) {
    this.logger.info({ message, meta });
  }

  /**
   * Log with log level debug
   * @param {string} message
   * @param {*} meta
   */
  debug(message, meta) {
    this.logger.debug({ message, meta });
  }

  /**
   * Log with log level silly
   * @param {string} message
   * @param {*} meta
   */
  silly(message, meta) {
    this.logger.silly({ message, meta });
  }
}

export default Logger;
