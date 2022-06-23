import ExcelResolver from '../../src/common/resolver/excel-resolver'
import fs from 'fs'
import path from 'path'
import lodash from 'lodash'
import { expect } from 'chai'
import { ExcelProductItem, ExcelProductTransformer } from '../../src/common/transform/product/excel-product.transform'

describe('Transform', () => {
  describe('Excel Product', () => {
    it('can be used', async () => {
      const excelData = fs.readFileSync(path.join(__dirname, '..', 'resources', 'jewelery.xlsx'))
      const provider = new ExcelResolver<ExcelProductItem, ExcelProductItem[]>('jewelery.xlsx', excelData)
      const data = await provider.getData()
      const transformed = new ExcelProductTransformer().transform(data)
      expect(transformed.length).to.equal(lodash.uniqBy(data, 'Handle').length)
    })
  })
})
