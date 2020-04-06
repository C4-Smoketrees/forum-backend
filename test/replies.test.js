const { assert } = require('chai')
const { describe, it } = require('mocha')
const app = require('../app')
const Thread = require('../modules/threads/model')
const Reply = require('../modules/replies/model')
const bson = require('bson')

describe('# Replies test-suite', function () {
  describe('# CRUD for replies', function () {
    it('Create a new Reply', async function () {
      const thread = new Thread({ content: 'reply thread', author: new bson.ObjectID(bson.ObjectID.generate()) })
      const res1 = await Thread.createThread(thread, app.locals.threadCollection)
      assert.isTrue(res1.status)

      const reply = new Reply({ content: 'reply', author: new bson.ObjectID(bson.ObjectID.generate()) })
      const res2 = await Reply.createReply(reply, { threadId: thread._id.toHexString() },
        app.locals.threadCollection, app.locals.replyCollection)
      assert.isTrue(res2.status)

      const res3 = await Reply.createReply(reply, { replyId: reply._id.toHexString() },
        app.locals.threadCollection, app.locals.replyCollection)
      assert.isTrue(res3.status)
    })

    it('update a Reply', async function () {
      const thread = new Thread({ content: 'update thread', author: new bson.ObjectID(bson.ObjectID.generate()) })
      const res1 = await Thread.createThread(thread, app.locals.threadCollection)
      assert.isTrue(res1.status)

      const author = new bson.ObjectID(bson.ObjectID.generate())

      const reply1 = new Reply({ content: 'reply 1', author: author })
      const res2 = await Reply.createReply(reply1, { threadId: thread._id.toHexString() }, app.locals.threadCollection, app.locals.replyCollection)
      assert.isTrue(res2.status)

      const reply2 = new Reply({ content: 'reply 2', author: new bson.ObjectID(bson.ObjectID.generate()) })
      const res3 = await Reply.createReply(reply2, { threadId: thread._id.toHexString() }, app.locals.threadCollection, app.locals.replyCollection)
      assert.isTrue(res3.status)
      reply1.content = 'update reply'

      const res4 = await Reply.updateReplyContent(reply1, author.toHexString(), app.locals.replyCollection)
      assert.isTrue(res4.status)

      reply1._id = new bson.ObjectID(bson.ObjectID.generate())
      const res5 = await Reply.updateReplyContent(reply2, author.toHexString(), app.locals.replyCollection)
      assert.isFalse(res5.status)
    })
    it('delete a Reply', async function () {
      const thread = new Thread({ content: 'update thread', author: new bson.ObjectID(bson.ObjectID.generate()) })
      const res1 = await Thread.createThread(thread, app.locals.threadCollection)
      assert.isTrue(res1.status)

      const author = new bson.ObjectID(bson.ObjectID.generate())

      const reply1 = new Reply({ content: 'reply 1', author: author })
      const res2 = await Reply.createReply(reply1, { threadId: thread._id.toHexString() }, app.locals.threadCollection,
        app.locals.replyCollection)
      assert.isTrue(res2.status)

      const reply2 = new Reply({ content: 'reply 2', author: author })
      const res5 = await Reply.createReply(reply2, { replyId: reply1._id.toHexString() },
        app.locals.threadCollection, app.locals.replyCollection)
      assert.isTrue(res5.status)

      const res4 = await Reply.deleteReply(reply2._id.toHexString(), { replyId: reply1._id.toHexString() },
        app.locals.threadCollection, app.locals.replyCollection)
      assert.isTrue(res4.status)

      const res3 = await Reply.deleteReply(reply1._id.toHexString(), { threadId: thread._id.toHexString() },
        app.locals.threadCollection, app.locals.replyCollection)
      assert.isTrue(res3.status)
    })

    it('Upvote a reply', async function () {
      const thread = new Thread({ content: 'update thread', author: new bson.ObjectID(bson.ObjectID.generate()) })
      const res1 = await Thread.createThread(thread, app.locals.threadCollection)
      assert.isTrue(res1.status)

      const author = new bson.ObjectID(bson.ObjectID.generate())

      const reply1 = new Reply({ content: 'reply 1', author: author })
      const res2 = await Reply.createReply(reply1, { threadId: thread._id.toHexString() }, app.locals.threadCollection,
        app.locals.replyCollection)
      assert.isTrue(res2.status)

      const reply2 = new Reply({ content: 'reply 2', author: author })
      const res3 = await Reply.createReply(reply2, { replyId: reply1._id.toHexString() },
        app.locals.threadCollection, app.locals.replyCollection)
      assert.isTrue(res3.status)

      const res4 = await Reply.addReplyUpvote(reply1._id.toHexString(), author.toHexString()
        , app.locals.replyCollection)
      assert.isTrue(res4.status)
      const res5 = await Reply.addReplyUpvote(reply2._id.toHexString(), author.toHexString(),
        app.locals.replyCollection)
      assert.isTrue(res5.status)
      const res6 = await Reply.readReply(reply1._id.toHexString(), app.locals.replyCollection)
      assert.isTrue(res6.status)
      assert.equal(res6.reply.upvotesCount, 1)
      const res7 = await Reply.readReply(reply2._id.toHexString(), app.locals.replyCollection)
      assert.isTrue(res7.status)
      assert.equal(res7.reply.upvotesCount, 1)
    })

    it('Downvote a reply', async function () {
      const thread = new Thread({ content: 'update thread', author: new bson.ObjectID(bson.ObjectID.generate()) })
      const res1 = await Thread.createThread(thread, app.locals.threadCollection)
      assert.isTrue(res1.status)

      const author = new bson.ObjectID(bson.ObjectID.generate())

      const reply1 = new Reply({ content: 'reply 1', author: author })
      const res2 = await Reply.createReply(reply1, { threadId: thread._id.toHexString() }, app.locals.threadCollection,
        app.locals.replyCollection)
      assert.isTrue(res2.status)

      const reply2 = new Reply({ content: 'reply 2', author: author })
      const res3 = await Reply.createReply(reply2, { replyId: reply1._id.toHexString() },
        app.locals.threadCollection, app.locals.replyCollection)
      assert.isTrue(res3.status)

      const res4 = await Reply.addReplyDownvote(reply1._id.toHexString(), author.toHexString()
        , app.locals.replyCollection)
      assert.isTrue(res4.status)
      const res5 = await Reply.addReplyDownvote(reply2._id.toHexString(), author.toHexString(),
        app.locals.replyCollection)
      assert.isTrue(res5.status)
      const res6 = await Reply.readReply(reply1._id.toHexString(), app.locals.replyCollection)
      assert.isTrue(res6.status)
      assert.equal(res6.reply.downvotesCount, 1)
      const res7 = await Reply.readReply(reply2._id.toHexString(), app.locals.replyCollection)
      assert.isTrue(res7.status)
      assert.equal(res7.reply.downvotesCount, 1)
    })

    it('remove Upvote a reply', async function () {
      const thread = new Thread({ content: 'update thread', author: new bson.ObjectID(bson.ObjectID.generate()) })
      const res1 = await Thread.createThread(thread, app.locals.threadCollection)
      assert.isTrue(res1.status)

      const author = new bson.ObjectID(bson.ObjectID.generate())

      const reply1 = new Reply({ content: 'reply 1', author: author })
      const res2 = await Reply.createReply(reply1, { threadId: thread._id.toHexString() }, app.locals.threadCollection,
        app.locals.replyCollection)
      assert.isTrue(res2.status)

      const reply2 = new Reply({ content: 'reply 2', author: author })
      const res3 = await Reply.createReply(reply2, { replyId: reply1._id.toHexString() },
        app.locals.threadCollection, app.locals.replyCollection)
      assert.isTrue(res3.status)

      const res4 = await Reply.addReplyUpvote(reply1._id.toHexString(), author.toHexString()
        , app.locals.replyCollection)
      assert.isTrue(res4.status)
      const res5 = await Reply.addReplyUpvote(reply2._id.toHexString(), author.toHexString(),
        app.locals.replyCollection)
      assert.isTrue(res5.status)
      const res6 = await Reply.readReply(reply1._id.toHexString(), app.locals.replyCollection)
      assert.isTrue(res6.status)
      assert.equal(res6.reply.upvotesCount, 1)
      const res7 = await Reply.readReply(reply2._id.toHexString(), app.locals.replyCollection)
      assert.isTrue(res7.status)
      assert.equal(res7.reply.upvotesCount, 1)
      const res8 = await Reply.removeReplyUpvote(reply1._id.toHexString(), author.toHexString(), app.locals.replyCollection)
      assert.isTrue(res8.status)
      const res9 = await Reply.readReply(reply1._id.toHexString(), app.locals.replyCollection)
      assert.isTrue(res9.status)
      assert.equal(res9.reply.upvotesCount, 0)
    })
    it('remove downvote a reply', async function () {
      const thread = new Thread({ content: 'update thread', author: new bson.ObjectID(bson.ObjectID.generate()) })
      const res1 = await Thread.createThread(thread, app.locals.threadCollection)
      assert.isTrue(res1.status)

      const author = new bson.ObjectID(bson.ObjectID.generate())

      const reply1 = new Reply({ content: 'reply 1', author: author })
      const res2 = await Reply.createReply(reply1, { threadId: thread._id.toHexString() }, app.locals.threadCollection,
        app.locals.replyCollection)
      assert.isTrue(res2.status)

      const reply2 = new Reply({ content: 'reply 2', author: author })
      const res3 = await Reply.createReply(reply2, { replyId: reply1._id.toHexString() },
        app.locals.threadCollection, app.locals.replyCollection)
      assert.isTrue(res3.status)

      const res4 = await Reply.addReplyDownvote(reply1._id.toHexString(), author.toHexString()
        , app.locals.replyCollection)
      assert.isTrue(res4.status)
      const res5 = await Reply.addReplyDownvote(reply2._id.toHexString(), author.toHexString(),
        app.locals.replyCollection)
      assert.isTrue(res5.status)
      const res6 = await Reply.readReply(reply1._id.toHexString(), app.locals.replyCollection)
      assert.isTrue(res6.status)
      assert.equal(res6.reply.downvotesCount, 1)
      const res7 = await Reply.readReply(reply2._id.toHexString(), app.locals.replyCollection)
      assert.isTrue(res7.status)
      assert.equal(res7.reply.downvotesCount, 1)
      const res8 = await Reply.removeReplyDownvote(reply1._id.toHexString(), author.toHexString(), app.locals.replyCollection)
      assert.isTrue(res8.status)
      const res9 = await Reply.readReply(reply1._id.toHexString(), app.locals.replyCollection)
      assert.isTrue(res9.status)
      assert.equal(res9.reply.downvotesCount, 0)
    })
  })
})
