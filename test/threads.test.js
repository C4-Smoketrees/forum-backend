const { assert } = require('chai')
const { describe, before, it, after } = require('mocha')
const app = require('../app')
const Thread = require('../modules/threads/model')
const bson = require('bson')
const MongoClient = require('mongodb').MongoClient

after(async function () {
  await app.locals.dbClient.close()
})
before(function () {
  const dbConnectionString = 'mongodb://localhost:27017' || process.env.DB_CONN_STRING
  return async () => {
    const dbPromise = await MongoClient.connect(dbConnectionString, { useUnifiedTopology: true })
    const dbClient = await dbPromise
    const db = await dbClient.db('forum')
    console.log(db)
    const threadCollection = await db.collection('threads')
    console.log(threadCollection)
    await db.collection('replies')
    await db.collection('tags')
    await threadCollection.indexInformation()
    const threadIndexes = await threadCollection.indexInformation()
    if (!threadIndexes.title_text_content_text && !threadIndexes.content_text_title_text) {
      await threadCollection.createIndex({ content: 'text', title: 'text' })
      console.log('--------index------------------')
    }
  }
})
describe('# Threads test-suite', function () {
  describe('# Crud Operations', function () {
    // Create a new Thread and update it
    it('Create a new Thread and update it', async function () {
      // For Callback (Passing)
      try {
        const author = new bson.ObjectID(bson.ObjectID.generate())
        const thread = new Thread({
          author: author,
          title: 'test title',
          content: 'test content'
        })
        const res = await Thread.createThread(thread, app.locals.threadCollection)
        assert.isTrue(res.status)
        thread.content = 'update content'
        const res2 = await Thread.updateThreadContent(thread, author.toHexString(), app.locals.threadCollection)
        assert.isTrue(res2.status)
        thread._id = new bson.ObjectID(bson.ObjectID.generate())
        const res3 = await Thread.updateThreadContent(thread, app.locals.threadCollection)
        assert.isFalse(res3.status)
      } catch (e) {
      }
    })
    it('Create a new Thread and read it', async function () {
      // For Callback (Passing)
      try {
        const user1 = new bson.ObjectID(bson.ObjectID.generate())
        const user2 = new bson.ObjectID(bson.ObjectID.generate())
        const thread = new Thread({
          author: user1,
          content: 'read content'
        })
        const res = await Thread.createThread(thread, app.locals.threadCollection)
        assert.isTrue(res.status)
        await Thread.addUpvote(thread._id.toHexString(), user1.toHexString(), app.locals.threadCollection)
        await Thread.addUpvote(thread._id.toHexString(), user2.toHexString(), app.locals.threadCollection)
        const res2 = await Thread.readThreadUsingId(thread._id.toHexString(), app.locals.threadCollection, user2.toHexString())

        assert.equal('read content', res2.thread.content)
        const res3 = await Thread.readThreadUsingId(new bson.ObjectID(bson.ObjectID.generate()).toHexString(), app.locals.threadCollection)
        assert.isFalse(res3.status)
      } catch (e) {
        assert.isTrue(false)
      }
    })
    it('Real all threads', async function () {
      // For Callback (Passing)
      try {
        const thread = new Thread({
          author: new bson.ObjectID(bson.ObjectID.generate()),
          content: 'read content'
        })
        const res = await Thread.createThread(thread, app.locals.threadCollection)
        assert.isTrue(res.status)
        const res2 = await Thread.readAllThreads(app.locals.threadCollection)
        assert.isTrue(res2.status)
      } catch (e) {
        assert.isTrue(false)
      }
    })
    it('Create a new Thread and delete it', async function () {
      // For Callback (Passing)
      try {
        const thread = new Thread({ author: new bson.ObjectID(bson.ObjectID.generate()), content: 'delete content' })
        const res = await Thread.createThread(thread, app.locals.threadCollection)
        assert.isTrue(res.status)
        const res2 = await Thread.deleteThreadUsingId(thread._id.toHexString(), app.locals.threadCollection)
        assert.isTrue(res2.status)
        const res3 = await Thread.deleteThreadUsingId(new bson.ObjectID(bson.ObjectID.generate()).toHexString(), app.locals.threadCollection)
        assert.isFalse(res3.status)
      } catch (e) {
        assert.isTrue(false)
      }
    })
    it('Find using thread tag', async function () {
      try {
        const thread = new Thread({
          author: new bson.ObjectID(bson.ObjectID.generate()),
          content: 'tag content',
          tags: ['google', 'noob']
        })
        let res = await Thread.createThread(thread, app.locals.threadCollection)
        assert.isTrue(res.status)
        thread.tags = ['google', 'twitter']
        res = await Thread.createThread(thread, app.locals.threadCollection)
        assert.isTrue(res.status)
        thread.tags = ['hello', 'twitter']
        res = await Thread.createThread(thread, app.locals.threadCollection)
        assert.isTrue(res.status)
        res = await Thread.readThreadByTag('twitter', app.locals.threadCollection)

        assert.isTrue(res.status)
      } catch (e) {
        assert.isTrue(false)
      }
    })
    it('Create a new Thread and change it stars', async function () {
      try {
        const thread = new Thread({
          author: new bson.ObjectID(bson.ObjectID.generate()),
          content: 'stars content'
        })
        const res = await Thread.createThread(thread, app.locals.threadCollection)
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
        const res1 = await Thread.createThread(thread, app.locals.threadCollection)
        assert.isTrue(res1.status)
        const user = new bson.ObjectID(bson.ObjectID.generate())
        const res2 = await Thread.addUpvote(thread._id.toHexString(), user.toHexString(), app.locals.threadCollection)
        assert.isTrue(res2.status)
        const res3 = await Thread.addUpvote(thread._id.toHexString(), user.toHexString(), app.locals.threadCollection)
        assert.isFalse(res3.status)
        const res4 = await Thread.removeUpvote(thread._id.toHexString(), user.toHexString(), app.locals.threadCollection)
        assert.isTrue(res4.status)
        const res6 = await Thread.removeUpvote(thread._id.toHexString(), user.toHexString(), app.locals.threadCollection)
        assert.isFalse(res6.status)
        const res5 = await Thread.addUpvote(thread._id.toHexString(), user.toHexString(), app.locals.threadCollection)
        assert.isTrue(res5.status)
      } catch (e) {
        assert.isTrue(false)
      }
    })

    it('Downvote a content', async function () {
      try {
        const thread = new Thread({
          author: new bson.ObjectID(bson.ObjectID.generate()),
          content: 'upvote content'
        })
        const res1 = await Thread.createThread(thread, app.locals.threadCollection)
        assert.isTrue(res1.status)
        const user = new bson.ObjectID(bson.ObjectID.generate())
        const res2 = await Thread.addDownvote(thread._id.toHexString(), user.toHexString(), app.locals.threadCollection)
        assert.isTrue(res2.status)
        const res3 = await Thread.addDownvote(thread._id.toHexString(), user.toHexString(), app.locals.threadCollection)
        assert.isFalse(res3.status)
        const res4 = await Thread.removeDownvote(thread._id.toHexString(), user.toHexString(), app.locals.threadCollection)
        assert.isTrue(res4.status)
        const res6 = await Thread.removeDownvote(thread._id.toHexString(), user.toHexString(), app.locals.threadCollection)
        assert.isFalse(res6.status)
        const res5 = await Thread.addDownvote(thread._id.toHexString(), user.toHexString(), app.locals.threadCollection)
        assert.isTrue(res5.status)
      } catch (e) {
        assert.isTrue(false)
      }
    })
    it('Search thread', async function () {
      const res = await Thread.search('draft', Date.now(), app.locals.threadCollection)
      console.log(res)
      assert.isTrue(res.status)
    })
  })
})
