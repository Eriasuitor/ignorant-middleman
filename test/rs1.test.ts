import supertest from 'supertest'
import { assert } from 'chai'
import app from '../src/app'

const request = supertest(app)

describe('rs1', () => {
  it('can be fetched', async () => {
    await request.get('/hihi')
      .expect(200)
      .then(res => {
        assert.deepEqual(res.body, { a: 13 })
      })
  })
})
