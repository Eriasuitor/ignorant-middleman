import config from './config.local'

export interface Config {
  port: number
  logger: { level: string }
  shopify: {accessToken: string, domain: string}
}

export default config
