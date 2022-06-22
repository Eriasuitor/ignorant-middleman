import supertest from 'supertest'
import { assert } from 'chai'
import getApp from '../src/app'

let request: supertest.SuperTest<supertest.Test>

describe('Shopify', () => {
  before(async function () {
    request = supertest(await getApp())
  })
  describe('productions', () => {
    it('can be fetched', async () => {
      await new Promise((resolve, reject) => {
        setTimeout(resolve, 3000)
      })
      await request.get('/products')
        .expect(200)
        .then(res => {
          assert.deepEqual(res.body, { a: 13 })
        })
    })
  })
})
