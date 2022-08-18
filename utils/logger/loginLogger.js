import winston from "winston";
import "winston-daily-rotate-file";
import { transports, createLogger, format, } from "winston";
const dashLog = new winston.transports.DailyRotateFile({
  filename: "./logs/login/login-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
}
);

const loginDash = winston.createLogger({
    format: format.combine(
      format.timestamp(),
      format.json()
  ),
  transports: [
    dashLog,
    // new winston.transports.Console({  colorize: true, }),
  ],
});




export { loginDash };



