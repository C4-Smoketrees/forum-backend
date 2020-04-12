const app = require('../app.js')
const chai = require('chai')
const assert = chai.assert
const bson = require('bson')
const chaiHttp = require('chai-http')
const { describe, it } = require('mocha')
chai.use(chaiHttp)
const User = require('../modules/users/model')
const jwt = require('jsonwebtoken')

describe('# Route test for /report', function () {
  it('POST /thread', async function () {
    const draft = { content: 'draft content', title: 'draft title', tags: ['#google', '#noob'] }
    const token = jwt.decode('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k')

    const author1 = bson.ObjectID.createFromHexString(token._id)
    const res1 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection, app.locals.tagCollection)
    const user = new User({ _id: author1 })
    const res2 = await user.publishDraft(res1.draftId, app.locals.userCollection, app.locals.threadCollection)

    const res = await chai.request(app)
      .post(`/reports/thread?threadId=${res2.threadId}`)
      .set({
        Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k',
        'Content-Type': 'application/json'
      })
      .send({ report: { reportReason: 1, description: 'lund' } })

    assert.isTrue(res.body.status)
  })

  it('POST /report/reply', async function () {
    const draft = { content: 'draft content', title: 'draft title', tags: ['#google', '#noob'] }
    const token = jwt.decode('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k')

    const author1 = bson.ObjectID.createFromHexString(token._id)
    const res1 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection, app.locals.tagCollection)
    const user = new User({ _id: author1 })
    const res2 = await user.publishDraft(res1.draftId, app.locals.userCollection, app.locals.threadCollection)

    const res3 = await user.addReply({
      content: 'reply',
      author: author1
    }, { threadId: res2.threadId }, app.locals.userCollection, app.locals.threadCollection, app.locals.replyCollection)

    const res = await chai.request(app)
      .post(`/reports/reply?threadId=${res2.threadId}&replyId=${res3.replyId}`)
      .set({
        Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k',
        'Content-Type': 'application/json'
      })
      .send({ report: { reportReason: 1, description: 'lund' } })

    assert.isTrue(res.body.status)
  })
})
