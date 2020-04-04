const app = require('../app.js')
const chai = require('chai')
const assert = chai.assert
const bson = require('bson')
const chaiHttp = require('chai-http')
const { describe, it } = require('mocha')
const Thread = require('../modules/threads/model')
chai.use(chaiHttp)

describe('# Route test for /threads', function () {
  it('GET /one', async function () {
    let res
    try {
      const author = new bson.ObjectId(bson.ObjectId.generate())
      const response = await Thread.createThread({
        author: author,
        title: 'Title',
        content: 'route thread',
        tags: ['route', 'get', 'one', 'thread']
      }, app.locals.threadCollection)
      console.log(response)
      res = await chai.request(app)
        .get(`/threads/one?threadId=${response.threadId}`)
        .send()
    } catch (e) {
      console.log(e)
      assert.isNull(e)
    }
    assert.equal(res.status, 200)
  })
})
