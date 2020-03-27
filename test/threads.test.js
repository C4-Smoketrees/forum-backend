const { assert } = require('chai')
const { describe, before, it, after } = require('mocha')
const app = require('../app')
const Thread = require('../modules/threads/model')
const bson = require('bson')

after(async function () {
  await app.locals.dbClient.close()
})
before(async function () {
  await app.locals.dbClient
  try {
    await app.locals.threadCollection.drop()
  } catch (e) {
  }
})
describe('# Threads test-suite', function () {
  describe('# Crud Operations', function () {
    // Create a new thread and update it
    it('Create a new thread and update it', async function () {
      // For Callback (Passing)
      try {
        const thread = new Thread({ author: new bson.ObjectID(bson.ObjectID.generate()), content: 'test content' })
        const res = await thread.createThread(app.locals.threadCollection)
        assert.isTrue(res.status)
        thread.content = 'update content'
        const res2 = await thread.updateThreadContent(app.locals.threadCollection)
        assert.isTrue(res2.status)
        thread._id = new bson.ObjectID(bson.ObjectID.generate())
        const res3 = await thread.updateThreadContent(app.locals.threadCollection)
        assert.isFalse(res3.status)
      } catch (e) {
      }
    })
    it('Create a new thread and read it', async function () {
      // For Callback (Passing)
      try {
        const thread = new Thread({ author: new bson.ObjectID(bson.ObjectID.generate()), content: 'read content' })
        const res = await thread.createThread(app.locals.threadCollection)
        assert.isTrue(res.status)
        const res2 = await Thread.readThreadUsingId(thread._id.toHexString(), app.locals.threadCollection)
        assert.equal('read content', res2.thread.content)
        const res3 = await Thread.readThreadUsingId(new bson.ObjectID(bson.ObjectID.generate()).toHexString(), app.locals.threadCollection)
        assert.isFalse(res3.status)
      } catch (e) {
        console.log(e)
        assert.isTrue(false)
      }
    })
    it('Create a new thread and delete it', async function () {
      // For Callback (Passing)
      try {
        const thread = new Thread({ author: new bson.ObjectID(bson.ObjectID.generate()), content: 'delete content' })
        const res = await thread.createThread(app.locals.threadCollection)
        assert.isTrue(res.status)
        const res2 = await Thread.deleteThreadUsingId(thread._id.toHexString(), app.locals.threadCollection)
        assert.isTrue(res2.status)
        const res3 = await Thread.deleteThreadUsingId(new bson.ObjectID(bson.ObjectID.generate()).toHexString(), app.locals.threadCollection)
        assert.isFalse(res3.status)
      } catch (e) {
        console.log(e)
        assert.isTrue(false)
      }
    })
    it('Create a new thread and change it stars', async function () {
      try {
        const thread = new Thread({
          author: new bson.ObjectID(bson.ObjectID.generate()),
          content: 'stars content'
        })
        const res = await thread.createThread(app.locals.threadCollection)
        assert.isTrue(res.status)
        const res2 = await Thread.updateStars(thread._id.toHexString(), 'inc', app.locals.threadCollection)
        assert.isTrue(res2.status)
        const res3 = await Thread.updateStars(thread._id.toHexString(), 'inc', app.locals.threadCollection)
        assert.isTrue(res3.status)
        const res4 = await Thread.updateStars(thread._id.toHexString(), 'dec', app.locals.threadCollection)
        assert.isTrue(res4.status)
        const res5 = await Thread.readThreadUsingId(thread._id.toHexString(), app.locals.threadCollection)
        assert.equal(res5.thread.stars, 1, 'Stars expected')
        const res6 = await Thread.updateStars(new bson.ObjectID(bson.ObjectID.generate()).toHexString(),
          'inc', app.locals.threadCollection)
        assert.isFalse(res6.status)
        const res7 = await Thread.updateStars(thread._id.toHexString(), 'invalid', app.locals.threadCollection)
        assert.isFalse(res7.status)
      } catch (e) {
        assert.equal(e.message, 'Illegal Command')
      }
    })
    it('Upvote a content', async function () {
      try {
        const thread = new Thread({
          author: new bson.ObjectID(bson.ObjectID.generate()),
          content: 'upvote content'
        })
        const res1 = await thread.createThread(app.locals.threadCollection)
        assert.isTrue(res1.status)
        const user = new bson.ObjectID(bson.ObjectID.generate())
        const res2 = await Thread.AddUpvote(thread._id.toHexString(), user.toHexString(), app.locals.threadCollection)
        assert.isTrue(res2.status)
        const res3 = await Thread.AddUpvote(thread._id.toHexString(), user.toHexString(), app.locals.threadCollection)
        assert.isFalse(res3.status)
        const res4 = await Thread.RemoveUpvote(thread._id.toHexString(), user.toHexString(), app.locals.threadCollection)
        assert.isTrue(res4.status)
        const res6 = await Thread.RemoveUpvote(thread._id.toHexString(), user.toHexString(), app.locals.threadCollection)
        assert.isTrue(res6.status)
        const res5 = await Thread.AddUpvote(thread._id.toHexString(), user.toHexString(), app.locals.threadCollection)
        assert.isTrue(res5.status)
      } catch (e) {
        console.log(e)
        assert.isTrue(false)
      }
    })

    it('Downvote a content', async function () {
      try {
        const thread = new Thread({
          author: new bson.ObjectID(bson.ObjectID.generate()),
          content: 'upvote content'
        })
        const res1 = await thread.createThread(app.locals.threadCollection)
        assert.isTrue(res1.status)
        const user = new bson.ObjectID(bson.ObjectID.generate())
        const res2 = await Thread.AddDownvote(thread._id.toHexString(), user.toHexString(), app.locals.threadCollection)
        assert.isTrue(res2.status)
        const res3 = await Thread.AddDownvote(thread._id.toHexString(), user.toHexString(), app.locals.threadCollection)
        assert.isFalse(res3.status)
        const res4 = await Thread.RemoveDownvote(thread._id.toHexString(), user.toHexString(), app.locals.threadCollection)
        assert.isTrue(res4.status)
        const res6 = await Thread.RemoveDownvote(thread._id.toHexString(), user.toHexString(), app.locals.threadCollection)
        assert.isFalse(res6.status)
        const res5 = await Thread.AddDownvote(thread._id.toHexString(), user.toHexString(), app.locals.threadCollection)
        assert.isTrue(res5.status)
      } catch (e) {
        console.log(e)
        assert.isTrue(false)
      }
    })
  })
})
