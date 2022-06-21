import supertest from "supertest"
import chai, { assert } from "chai"
import app from "../src/app"

const request = supertest(app)

describe("rs1", async () => {
	it("can be fetched", () => {
		request.get('/hihi').expect(200).end((err, res) => {
			assert.deepEqual(res.body, { a: 13 })
		})
	})
})