import { addColors, createLogger, format, transports } from 'winston';

const { align, colorize, combine, printf, timestamp } = format;

function isDevEnvironment() {
  const env = process.env.NODE_ENV;
  if (env === 'development') return true;

  return false;
}

const customLevels = {
  levels: { fatal: 0, error: 1, warn: 2, info: 3, debug: 4, silly: 5 },
  colors: {
    fatal: 'red',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'cyan',
    silly: 'white',
  },
};

const devFormatter = combine(
  colorize(),
  format.cli(),
  timestamp({ format: 'HH:mm:ss' }),
  printf(({ timestamp, level, message, meta }) => {
    return `[${level}]${timestamp} ${message} ${
      meta ? `${JSON.stringify(meta, null, 2)}` : ''
    }`;
  }),
);

const prodFormatter = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  align(),
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

  fatal(message, meta) {
    this.logger.log('fatal', { message, meta });
  }

  error(message, meta) {
    this.logger.error({ message, meta });
  }

  warn(message, meta) {
    this.logger.warn({ message, meta });
  }

  info(message, meta) {
    this.logger.info({ message, meta });
  }

  debug(message, meta) {
    this.logger.debug({ message, meta });
  }

  silly(message, meta) {
    this.logger.silly({ message, meta });
  }
}

module.exports = Logger;
