import winston from 'winston'
import config from '../configs'

const logger = winston.createLogger({
  level: config.logger.level,
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
})

export default logger
