const { createLogger, transports, format } = require("winston");
const LokiTransport = require("winston-loki");

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new LokiTransport({
      host: "http://127.0.0.1:3100",
      labels: { job: "express-app" },
    }),
    new transports.Console(),
  ],
});

module.exports = logger;
