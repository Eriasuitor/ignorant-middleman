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
    app[method](uri, controller[propertyKey])
  }
}

function importAllFiles (location: string): void {
  const files = fs.readdirSync(location)
  files.forEach(file => {
    const fullPath = path.join(location, file)
    if (file.endsWith('.ts') || file.endsWith('.js')) {
      import(fullPath)
    } else if (fs.statSync(fullPath).isDirectory()) {
      importAllFiles(fullPath)
    }
  })
}

importAllFiles(__dirname)

export default app
