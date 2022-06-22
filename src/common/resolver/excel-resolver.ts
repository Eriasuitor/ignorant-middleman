import DataProvider from '../data-provider/provider.interface'
import ExcelJS, { Workbook } from 'exceljs'
import { Readable } from 'stream'
import assert from 'assert'
import lodash from 'lodash'
import path from 'path'
import { Transformer } from '../../interfaces/transformer/transformer.interface'

const excelDecoders: {[key: string]: (buffer: Buffer) => Promise<Workbook> } = {
  '.csv': async (buffer: Buffer): Promise<Workbook> => {
    const workbook = new Workbook()
    await workbook.csv.read(Readable.from(buffer))
    return workbook
  },
  '.xlsx': async (buffer: Buffer): Promise<Workbook> => {
    return await new ExcelJS.Workbook().xlsx.read(Readable.from(buffer))
  }
}

async function decodeExcel (filename: string, buffer: Buffer): Promise<Workbook> {
  const suffix = path.extname(filename)
  assert(excelDecoders[suffix] !== undefined, `Unsupported file type, only ${lodash.keys(excelDecoders).join(', ')} are supported.`)
  return await excelDecoders[suffix](buffer)
}

class ExcelResolver<T> implements DataProvider<T> {
  data: Buffer
  filename: string
  transformer?: Transformer<T>
  constructor (filename: string, data: Buffer, transformer?: Transformer<T>) {
    this.filename = filename
    this.data = data
    this.transformer = transformer
  }

  async resolve (worksheetNo: number): Promise<Array<{[key: string]: any}>> {
    const workbook = await decodeExcel(this.filename, this.data)
    assert(worksheetNo <= workbook.worksheets.length, `Index of worksheet out of range: ${worksheetNo}, max is ${workbook.worksheets.length}`)
    const worksheet = workbook.getWorksheet(worksheetNo)
    assert(worksheet.rowCount !== 0, '')
    const headers = worksheet.getRow(1).values as { [key: string]: string }
    return lodash.range(2, worksheet.rowCount + 1).map(index => {
      const rowValues = worksheet.getRow(index).values as { [key: string]: any }
      return lodash(headers)
        .keys()
        .reduce<{[key: string]: any}>(
        (result, col) => {
          result[headers[col]] = rowValues[col]
          return result
        }, {}
      )
    })
  }

  async getData (): Promise<T> {
    const data = await this.resolve(1)
    return (this.transformer != null) ? this.transformer.transform(data) : data as unknown as T
  }
}

export default ExcelResolver
