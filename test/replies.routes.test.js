const app = require('../app.js')
const chai = require('chai')
const assert = chai.assert
const bson = require('bson')
const chaiHttp = require('chai-http')
const { describe, it } = require('mocha')
const Reply = require('../modules/replies/model')
chai.use(chaiHttp)
const User = require('../modules/users/model')
const jwt = require('jsonwebtoken')

describe('# Route test for /replies', function () {
  it('test for /', async function () {
    const draft = { content: 'draft content', title: 'draft title', tags: ['#google', '#noob'] }
    const token = jwt.decode('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k')
    const author1 = bson.ObjectID.createFromHexString(token._id)
    const res1 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection, app.locals.tagCollection)
    const user = new User({ _id: author1 })
    const res2 = await user.publishDraft(res1.draftId, app.locals.userCollection, app.locals.threadCollection)
    assert.isTrue(res2.status)

    const res = await chai.request(app)
      .post('/replies')
      .set({
        Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k',
        'Content-Type': 'application/json'
      })
      .send({ id: { threadId: res2.threadId }, reply: { content: 'reply' } })

    assert.equal(res.status, 200)

    const res5 = await chai.request(app)
      .post('/replies')
      .set({
        Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k',
        'Content-Type': 'application/json'
      })
      .send({ id: { threadId: res2.threadId, replyId: res.body.replyId }, reply: { content: 'reply' } })
  })

  it('test for /delete', async function () {
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
      .post('/replies/delete')
      .set({
        Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k',
        'Content-Type': 'application/json'
      })
      .send({ id: { threadId: res2.threadId }, replyId: res3.replyId })

    assert.equal(res.status, 200)
  })

  it('test for /update', async function () {
    const draft = { content: 'draft content', title: 'draft title', tags: ['#google', '#noob'] }
    const token = jwt.decode('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k')
    const author1 = bson.ObjectID.createFromHexString(token._id)
    // const author1 = new bson.ObjectID(bson.ObjectID.generate())
    const res1 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection, app.locals.tagCollection)
    const user = new User({ _id: author1 })
    const res2 = await user.publishDraft(res1.draftId, app.locals.userCollection, app.locals.threadCollection)
    const res3 = await user.addReply({
      content: 'reply',
      author: author1
    }, { threadId: res2.threadId }, app.locals.userCollection, app.locals.threadCollection, app.locals.replyCollection)

    const res = await chai.request(app)
      .post('/replies/update')
      .set({
        Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k',
        'Content-Type': 'application/json'
      })
      .send({
        reply: {
          _id: res3.replyId,
          content: 'update'
        }
      })
    assert.equal(res.status, 200)
  })

  it('test for  route /upvote', async function () {
    const draft = { content: 'draft content', title: 'draft title', tags: ['#google', '#noob'] }
    const token = jwt.decode('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k')
    const author1 = bson.ObjectID.createFromHexString(token._id)
    // const author1 = new bson.ObjectID(bson.ObjectID.generate())
    const res1 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection, app.locals.tagCollection)
    const user = new User({ _id: author1 })
    const res2 = await user.publishDraft(res1.draftId, app.locals.userCollection, app.locals.threadCollection)
    const res3 = await user.addReply({
      content: 'reply',
      author: author1
    }, { threadId: res2.threadId }, app.locals.userCollection, app.locals.threadCollection, app.locals.replyCollection)

    const res = await chai.request(app)
      .post('/replies/upvote')
      .set({
        Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k',
        'Content-Type': 'application/json'
      })
      .send({
        replyId: res3.replyId
      })

    assert.equal(res.status, 200)
  })

  it('test for  route /downvote', async function () {
    const draft = { content: 'draft content', title: 'draft title', tags: ['#google', '#noob'] }
    const token = jwt.decode('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k')
    const author1 = bson.ObjectID.createFromHexString(token._id)
    // const author1 = new bson.ObjectID(bson.ObjectID.generate())
    const res1 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection, app.locals.tagCollection)
    const user = new User({ _id: author1 })
    const res2 = await user.publishDraft(res1.draftId, app.locals.userCollection, app.locals.threadCollection)
    const res3 = await user.addReply({
      content: 'reply',
      author: author1
    }, { threadId: res2.threadId }, app.locals.userCollection, app.locals.threadCollection, app.locals.replyCollection)

    const res = await chai.request(app)
      .post('/replies/downvote')
      .set({
        Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k',
        'Content-Type': 'application/json'
      })
      .send({
        replyId: res3.replyId
      })

    assert.equal(res.status, 200)
  })

  it('test for  route /removeUpvote', async function () {
    const draft = { content: 'draft content', title: 'draft title', tags: ['#google', '#noob'] }
    const token = jwt.decode('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k')
    const author1 = bson.ObjectID.createFromHexString(token._id)
    // const author1 = new bson.ObjectID(bson.ObjectID.generate())
    const res1 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection, app.locals.tagCollection)
    const user = new User({ _id: author1 })
    const res2 = await user.publishDraft(res1.draftId, app.locals.userCollection, app.locals.threadCollection)
    const res3 = await user.addReply({
      content: 'reply',
      author: author1
    }, { threadId: res2.threadId }, app.locals.userCollection, app.locals.threadCollection, app.locals.replyCollection)

    await Reply.addReplyUpvote(res3.replyId, token._id, app.locals.replyCollection)

    const res = await chai.request(app)
      .post('/replies/removeUpvote')
      .set({
        Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k',
        'Content-Type': 'application/json'
      })
      .send({
        threadId: res2.threadId,
        replyId: res3.replyId
      })

    assert.equal(res.status, 200)
  })

  it('test for  route /removeDownvote', async function () {
    const draft = { content: 'draft content', title: 'draft title', tags: ['#google', '#noob'] }
    const token = jwt.decode('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k')
    const author1 = bson.ObjectID.createFromHexString(token._id)
    // const author1 = new bson.ObjectID(bson.ObjectID.generate())
    const res1 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection, app.locals.tagCollection)
    const user = new User({ _id: author1 })
    const res2 = await user.publishDraft(res1.draftId, app.locals.userCollection, app.locals.threadCollection)
    const res3 = await user.addReply({
      content: 'reply',
      author: author1
    }, { threadId: res2.threadId }, app.locals.userCollection, app.locals.threadCollection, app.locals.replyCollection)

    await Reply.addReplyDownvote(res3.replyId, token._id, app.locals.replyCollection)

    const res = await chai.request(app)
      .post('/replies/upvote')
      .set({
        Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k',
        'Content-Type': 'application/json'
      })
      .send({
        threadId: res2.threadId,
        replyId: res3.replyId
      })

    assert.equal(res.status, 200)
  })
})
