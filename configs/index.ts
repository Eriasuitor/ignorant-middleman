import config from './config.local'

export interface Config {
	port: number;
	logger: { level: string }
}

export default config