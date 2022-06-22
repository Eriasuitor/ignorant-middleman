import config from '../configs'
import app from '../src/app'
import logger from '../src/logger'

app.listen(config.port, () => {
  logger.info('Server started', { port: config.port })
})
