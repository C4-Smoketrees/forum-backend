const app = require('../app.js')
const chai = require('chai')
const assert = chai.assert
const bson = require('bson')
const chaiHttp = require('chai-http')
const { describe, it } = require('mocha')
const Thread = require('../modules/threads/model')
chai.use(chaiHttp)
const User = require('../modules/users/model')
const jwt = require('jsonwebtoken')

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

      res = await chai.request(app)
        .get(`/threads/one?threadId=${response.threadId}`)
        .send()
    } catch (e) {
      assert.isNull(e)
    }
    assert.equal(res.status, 200)
  })

  it('GET /all', async function () {
    let res
    try {
      const author = new bson.ObjectId(bson.ObjectId.generate())
      const response = await Thread.createThread({
        author: author,
        title: 'Title',
        content: 'route thread',
        tags: ['route', 'get', 'one', 'thread']
      }, app.locals.threadCollection)
      res = await chai.request(app)
        .get(`/threads/one?threadId=${response.threadId}`)
        .send()
    } catch (e) {
      assert.isNull(e)
    }

    assert.equal(res.status, 200)
  })

  it('POST /delete', async function () {
    let res
    try {
      const draft = { content: 'draft content', title: 'draft title', tags: ['#google', '#noob'] }
      const token = jwt.decode('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k')

      const author1 = bson.ObjectID.createFromHexString(token._id)
      const res1 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection, app.locals.tagCollection)
      const user = new User({ _id: author1 })
      const res2 = await user.publishDraft(res1.draftId, app.locals.userCollection, app.locals.threadCollection)
      res = await chai.request(app)
        .post('/threads/delete')
        .set({
          Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k',
          'Content-Type': 'application/json'
        })
        .send({ _id: res2.threadId })
    } catch (e) {
      assert.isNull(e)
    }

    assert.equal(res.status, 200)
  })

  it('POST /update', async function () {
    let res
    try {
      const draft = { content: 'draft content', title: 'draft title', tags: ['#google', '#noob'] }
      const token = jwt.decode('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k')
      const author1 = bson.ObjectID.createFromHexString(token._id)
      const res1 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection, app.locals.tagCollection)
      const user = new User({ _id: author1 })
      const res2 = await user.publishDraft(res1.draftId, app.locals.userCollection, app.locals.threadCollection)
      res = await chai.request(app)
        .post('/threads/update')
        .set({
          Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k',
          'Content-Type': 'application/json'
        })
        .send({ thread: { _id: res2.threadId, content: 'update', tags: ['update'] } })
    } catch (e) {
      assert.isNull(e)
    }

    assert.equal(res.status, 200)
  })
})
