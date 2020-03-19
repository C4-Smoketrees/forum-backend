const winston = require('winston')

const logger = winston.createLogger({
  format: winston.format.json(),
  level: 'silly',
  transports: [
    new winston.transports.Console()
  ]
})

module.exports = logger
