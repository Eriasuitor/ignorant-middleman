import config from '../configs'
import getApp from '../src/app'
import logger from '../src/logger'

function start (): void {
  void (async () => {
    const app = await getApp()
    app.listen(config.port, () => {
      logger.info('Server started', { port: config.port })
    })
  })()
}

start()
