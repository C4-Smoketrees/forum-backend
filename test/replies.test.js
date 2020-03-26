const { assert } = require('chai')
const { describe, beforeEach, it } = require('mocha')
const app = require('../app')
const Thread = require('../modules/threads/model')
const Reply = require('../modules/replies/model')
const bson = require('bson')

describe('# Replies test-suite', function () {
  beforeEach(async function () {
    await app.locals.dbClient
    try {
      await app.locals.threadCollection.drop()
    } catch (e) {
    }
  })

  describe('# CRUD for replies', function () {
    it('Create a new Reply', async function () {
      const thread = new Thread({ content: 'reply thread', author: new bson.ObjectID(bson.ObjectID.generate()) })
      const res1 = await thread.createThread(app.locals.threadCollection)
      assert.isTrue(res1.status)

      const reply = new Reply({ content: 'reply', author: new bson.ObjectID(bson.ObjectID.generate()) })
      const res2 = await reply.createReply(thread._id.toHexString(), app.locals.threadCollection)
      assert.isTrue(res2.status)

      thread._id = '231231'
      const res3 = await reply.createReply(thread._id, app.locals.threadCollection)
      assert.isFalse(res3.status)
    })
  })
})
