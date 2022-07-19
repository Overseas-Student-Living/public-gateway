import * as moment from "moment";
import { createLogger, format, transports } from "winston";

const colorizer = format.colorize();

const myFormat = format.printf(info => {
  const moduleName = info.meta ? info.meta.moduleName : info.moduleName;
  let messageInfo =
    `${info.timestampValue} [${info.level.toUpperCase()}] ` +
    `[${info.service}] [${moduleName}]`;
  if (!process.env.DISABLE_LOG_COLORS) {
    messageInfo = colorizer.colorize(info.level, messageInfo);
  }
  return `${messageInfo} ${info.message}`;
});

const serviceNameFormat = format(info => {
  info.service = "public-gateway";
  return info;
});

const timestampFormat = format(info => {
  info.timestampValue = moment().format("YYYY-MM-DD HH:mm:ss,SSS");
  return info;
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: format.combine(
    format.splat(),
    timestampFormat(),
    serviceNameFormat(),
    myFormat
  ),
  transports: [new transports.Console()],
  exceptionHandlers: [new transports.Console()]
});

export function getLogger(moduleName: string) {
  return new Proxy(logger, {
    get(target, logLevel) {
      return (...args) => {
        target[logLevel](...args, { moduleName });
      };
    }
  });
}
