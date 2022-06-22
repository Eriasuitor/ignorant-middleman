import supertest from 'supertest'
import { assert } from 'chai'
import getApp from '../src/app'

let request: supertest.SuperTest<supertest.Test>

describe('rs1', () => {
  before(async function () {
    request = supertest(await getApp())
  })

  it('can be fetched', async () => {
    await request.get('/hihi')
      .expect(200)
      .then(res => {
        assert.deepEqual(res.body, { a: 13 })
      })
  })
})
