import ExcelResolver from '../../src/common/resolver/excel-resolver'
import fs from 'fs'
import path from 'path'
import { assert } from 'chai'
import { ProductItem } from '../../src/interfaces/product.interface'
import { ExcelProductItem } from '../../src/common/transform/product/excel-product.transform'

describe('Data Provider', () => {
  describe('excel', () => {
    it('can get data', async () => {
      const excelData = fs.readFileSync(path.join(__dirname, '..', 'resources', 'jewelery.xlsx'))
      const provider = new ExcelResolver<ExcelProductItem, ProductItem[]>('jewelery.xlsx', excelData)
      const result = await provider.getData()
      assert.isArray(result)
      assert.equal(result.length, 41)
      assert.isObject(result[0])
    })
  })
})
