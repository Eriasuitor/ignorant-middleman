import express from 'express'
import logger from './logger'
import path from 'path'
import fs from 'fs'

const app = express()

export enum Method {
  GET = 'get',
  PUT = 'put',
  POST = 'post',
  DELETE = 'delete'
}

const dependencyInversion = new Map()

export function RequestMapping (method: Method, uri: string): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    const Class = target.constructor as new () => void
    if (!dependencyInversion.has(Class)) {
      dependencyInversion.set(Class, new Class())
    }
    const controller = dependencyInversion.get(Class)
    logger.debug('Uri registered', { method, uri })
    app[method](uri, (req, res, next) => {
      void (async () => {
        logger.debug('New Request', { uri, method, body: req.body })
        try {
          await controller[propertyKey](req, res)
        } catch (error) {
          if (error instanceof Error) {
            logger.error('Handle failed', { uri, method, body: req.body, message: error.message, stack: error.stack })
          }
          next(error)
        }
      })()
    })
  }
}

async function importAllFiles (location: string): Promise<void> {
  const files = fs.readdirSync(location)
  for (const file of files) {
    const fullPath = path.join(location, file)
    if (file.endsWith('.ts') || file.endsWith('.js')) {
      await import(fullPath)
    } else if (fs.statSync(fullPath).isDirectory()) {
      await importAllFiles(fullPath)
    }
  }
}

async function getApp (): Promise<express.Express> {
  await importAllFiles(__dirname)
  return app
}

export default getApp
