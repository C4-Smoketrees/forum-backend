const { assert } = require('chai')
const { describe, beforeEach, it, after } = require('mocha')
const app = require('../../app')
const Thread = require('../../modules/threads/model')
const bson = require('bson')

after(async function () {
  await app.locals.dbClient.close()
})

describe('# Threads test-suite', function () {
  beforeEach(async function () {
    await app.locals.dbClient
    try {
      await app.locals.threadCollection.drop()
    } catch (e) {
    }
  })
  describe('# Crud Operations', function () {
    // Create a new thread and update it
    it('Create a new thread and update it', async function () {
      // For Callback (Passing)
      try {
        const thread = new Thread({ author: new bson.ObjectID(bson.ObjectID.generate()), content: 'test content' })
        const res = await thread.createThread()
        assert.isTrue(res.status)
        thread.content = 'update content'
        const res2 = await thread.updateThreadContent()
        assert.isTrue(res2.status)
        thread._id = new bson.ObjectID(bson.ObjectID.generate())
        const res3 = await thread.updateThreadContent()
        assert.isFalse(res3.status)
      } catch (e) {
      }
    })
    it('Create a new thread and read it', async function () {
      // For Callback (Passing)
      try {
        const thread = new Thread({ author: new bson.ObjectID(bson.ObjectID.generate()), content: 'read content' })
        const res = await thread.createThread()
        assert.isTrue(res.status)
        const res2 = await Thread.readThreadUsingId(thread._id.toHexString())
        assert.equal('read content', res2.thread.content)
        const res3 = await Thread.readThreadUsingId(new bson.ObjectID(bson.ObjectID.generate()).toHexString())
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
        const res = await thread.createThread()
        assert.isTrue(res.status)
        const res2 = await Thread.deleteThreadUsingId(thread._id.toHexString())
        assert.isTrue(res2.status)
        const res3 = await Thread.deleteThreadUsingId(new bson.ObjectID(bson.ObjectID.generate()).toHexString())
        assert.isFalse(res3.status)
      } catch (e) {
        console.log(e)
        assert.isTrue(false)
      }
    })
    it('Create a new thread and change it stars', async function () {
      try {
        const thread = new Thread({ author: new bson.ObjectID(bson.ObjectID.generate()), content: 'stars content' })
        const res = await thread.createThread()
        assert.isTrue(res.status)
        const res2 = await Thread.updateStars(thread._id.toHexString(), 'inc')
        assert.isTrue(res2.status)
        const res3 = await Thread.updateStars(thread._id.toHexString(), 'inc')
        assert.isTrue(res3.status)
        const res4 = await Thread.updateStars(thread._id.toHexString(), 'dec')
        assert.isTrue(res4.status)
        const res5 = await Thread.readThreadUsingId(thread._id.toHexString())
        assert.equal(res5.thread.stars, 1, 'Stars expected')
        const res6 = await Thread.updateStars(new bson.ObjectID(bson.ObjectID.generate()).toHexString(), 'inc')
        assert.isFalse(res6.status)
        const res7 = await Thread.updateStars(thread._id.toHexString(), 'invalid')
        assert.isFalse(res7.status)
      } catch (e) {
        assert.equal(e.message, 'Illegal Command')
      }
    })
  })
})
