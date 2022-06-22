import supertest from 'supertest'
import getApp from '../src/app'
import fs from 'fs'
import path from 'path'

let request: supertest.SuperTest<supertest.Test>

describe('Shopify', () => {
  before(async function () {
    request = supertest(await getApp())
  })
  describe('products', () => {
    it('can be created with a csv file', async () => {
      const excelData = fs.readFileSync(path.join(__dirname, 'resources', 'jewelery.xlsx'))
      await request.post('/products')
        .attach('file', excelData, { filename: 'jewelery.xlsx' })
        .expect(200)
    })
  })
})
