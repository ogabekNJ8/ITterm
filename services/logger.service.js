const winston = require("winston");
const config = require("config")
require("winston-mongodb")

const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf, json, colorize } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = winston.createLogger({
  format: combine(
    // colorize({all: true}), // consolega oddiy formatda faqat
    label({ label: "ITTERM!" }),
    timestamp(),
    myFormat
    // json()
  ),
  transports: [
    new winston.transports.Console({ level: "debug" }),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({
      filename: "logs/combine.log",
      level: "info",
    }),
    new winston.transports.MongoDB({
      db: config.get("dbUri"),
      collection: "log"
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "logs/exceptions.log" }),
  ],
});

logger.exitOnError = false;

module.exports = logger;
