const { assert } = require('chai')
const { describe, it, before, after } = require('mocha')
const app = require('../app')
const User = require('../modules/users/model')
const Reply = require('../modules/replies/model')
const Thread = require('../modules/threads/model')
const bson = require('bson')

after(async function () {
  await app.locals.dbClient.close()
})

before(async function () {
  try {
  } catch (e) {
  }
})

describe('# User test-suite', function () {
  describe('# Crud Operations', function () {
    it('Create a draft', async function () {
      try {
        app.locals.test = await app.locals.db.collection('users')
        const draft = { content: 'new draft content', title: 'new draft title', tags: ['google', '23'] }
        const author1 = new bson.ObjectID(bson.ObjectID.generate())
        const res1 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection, app.locals.tagCollection)
        assert.isTrue(res1.status)
        draft.title = 'draft title2'
        draft.content = 'draft content2'
        const res2 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection, app.locals.tagCollection)
        assert.isTrue(res2.status)
      } catch (e) {
        assert.isTrue(false)
      }
    })
    it('Update a draft', async function () {
      try {
        const draft = { content: 'draft content', title: 'draft title' }
        const author1 = new bson.ObjectID(bson.ObjectID.generate())
        const res1 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection, app.locals.tagCollection)
        assert.isTrue(res1.status)
        draft._id = bson.ObjectID.createFromHexString(res1.draftId)
        draft.title = 'draft title2'
        draft.content = 'draft content2'
        const res2 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection, app.locals.tagCollection)
        assert.isTrue(res2.status)
        draft._id = bson.ObjectID.createFromHexString(res1.draftId)
        draft.title = 'update draft'
        draft.content = 'update draft content2'
        draft.tags = ['google']
        const res3 = await User.updateDraft(author1.toHexString(), draft, app.locals.userCollection, app.locals.tagCollection)
        assert.isTrue(res3.status)
      } catch (e) {
        assert.isTrue(false)
      }
    })
    it('read a draft', async function () {
      try {
        const draft = { content: 'draft content', title: 'draft title' }
        const author1 = new bson.ObjectID(bson.ObjectID.generate())
        const res1 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection, app.locals.tagCollection)
        assert.isTrue(res1.status)
        draft.content = 'draft content 2'
        draft.title = 'draft title 2'
        const res2 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection, app.locals.tagCollection)
        assert.isTrue(res2.status)
        const res3 = await User.readDraft(author1.toHexString(), res2.draftId, app.locals.userCollection)
        if (res3.draft.content !== 'draft content 2') {
          assert.isTrue(false)
        }
      } catch (e) {
        assert.isTrue(false)
      }
    })
    it('Delete a draft', async function () {
      const draft = { content: 'delete draft content', title: 'delete draft title' }
      const author1 = new bson.ObjectID(bson.ObjectID.generate())
      const res1 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection, app.locals.tagCollection)
      assert.isTrue(res1.status)
      const res2 = await User.deleteDraft(author1.toHexString(), draft._id.toHexString(), app.locals.userCollection)
      assert.isTrue(res2.status)
      const res3 = await User.deleteDraft(author1.toHexString(), draft._id.toHexString(), app.locals.userCollection)
      assert.isFalse(res3.status)
    })
    it('Read a user', async function () {
      const draft = { content: 'draft content', title: 'draft title', tags: ['#google', '#noob'] }
      const author1 = new bson.ObjectID(bson.ObjectID.generate())
      const res1 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection, app.locals.tagCollection)
      assert.isTrue(res1.status)
      const user = new User({ _id: author1 })
      const res2 = await user.publishDraft(res1.draftId, app.locals.userCollection, app.locals.threadCollection)

      assert.isTrue(res2.status)
      const res3 = await User.getUser(author1.toHexString(), app.locals.userCollection)
      assert.equal(res3.user._id.toHexString(), author1.toHexString())
    })
    it('Publish a draft', async function () {
      const draft = { content: 'draft content', title: 'draft title', tags: ['#google', '#noob'] }
      const author1 = new bson.ObjectID(bson.ObjectID.generate())
      const res1 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection, app.locals.tagCollection)
      assert.isTrue(res1.status)
      const user = new User({ _id: author1 })
      const res2 = await user.publishDraft(res1.draftId, app.locals.userCollection, app.locals.threadCollection)

      assert.isTrue(res2.status)
    })
    it('Delete a thread', async function () {
      const draft = { content: 'draft content', title: 'draft title' }
      const author1 = new bson.ObjectID(bson.ObjectID.generate())
      const res1 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection, app.locals.tagCollection)
      assert.isTrue(res1.status)
      const user = new User({ _id: author1 })
      const res2 = await user.publishDraft(res1.draftId, app.locals.userCollection, app.locals.threadCollection)

      assert.isTrue(res2.status)
      const res3 = await user.deleteThread(res2.threadId, app.locals.userCollection, app.locals.threadCollection)
      assert.isTrue(res3.status)
    })
    it('star a thread', async function () {
      const draft = { content: 'draft content', title: 'draft title' }
      const author1 = new bson.ObjectID(bson.ObjectID.generate())
      const res1 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection, app.locals.tagCollection)
      assert.isTrue(res1.status)
      const user = new User({ _id: author1 })
      const res2 = await user.publishDraft(res1.draftId, app.locals.userCollection, app.locals.threadCollection)

      assert.isTrue(res2.status)
      const res3 = await user.addStar(res2.threadId, app.locals.userCollection, app.locals.threadCollection)
      assert.isTrue(res3.status)
      const res4 = await Thread.readThreadUsingId(res2.threadId, app.locals.threadCollection)
      assert.equal(res4.thread.stars, 1)
    })
    it('un-star a thread', async function () {
      const draft = { content: 'draft content', title: 'draft title' }
      const author1 = new bson.ObjectID(bson.ObjectID.generate())
      const res1 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection, app.locals.tagCollection)
      assert.isTrue(res1.status)
      const user = new User({ _id: author1 })
      const res2 = await user.publishDraft(res1.draftId, app.locals.userCollection, app.locals.threadCollection)

      assert.isTrue(res2.status)
      const res3 = await user.addStar(res2.threadId, app.locals.userCollection, app.locals.threadCollection)
      assert.isTrue(res3.status)
      const res4 = await user.removeStar(res2.threadId, app.locals.userCollection, app.locals.threadCollection)
      assert.isTrue(res4.status)
      const res5 = await Thread.readThreadUsingId(res2.threadId, app.locals.threadCollection)
      assert.equal(res5.thread.stars, 0)
    })
    it('create a reply', async function () {
      const draft = { content: 'reply content', title: 'reply title' }
      const author1 = new bson.ObjectID(bson.ObjectID.generate())
      const res1 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection, app.locals.tagCollection)
      assert.isTrue(res1.status)
      const user = new User({ _id: author1 })
      const res2 = await user.publishDraft(res1.draftId, app.locals.userCollection, app.locals.threadCollection)

      assert.isTrue(res2.status)
      const reply = new Reply({ content: 'reply content', author: author1 })
      const res3 = await user.addReply(reply, res2.threadId, app.locals.userCollection, app.locals.threadCollection)
      assert.isTrue(res3.status)
      const res4 = await Thread.readThreadUsingId(res2.threadId, app.locals.threadCollection)
      assert.equal(res4.thread.replies[0].content, 'reply content')
    })
    it('delete a reply', async function () {
      const draft = { content: 'delete reply content', title: 'delete reply title' }
      const author1 = new bson.ObjectID(bson.ObjectID.generate())
      const res1 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection, app.locals.tagCollection)
      assert.isTrue(res1.status)
      const user = new User({ _id: author1 })
      const res2 = await user.publishDraft(res1.draftId, app.locals.userCollection, app.locals.threadCollection)

      assert.isTrue(res2.status)
      const reply = new Reply({ content: 'reply content', author: author1 })
      const res3 = await user.addReply(reply, res2.threadId, app.locals.userCollection, app.locals.threadCollection)
      assert.isTrue(res3.status)
      const res4 = await user.deleteReply(reply._id.toHexString(), res2.threadId, app.locals.userCollection, app.locals.threadCollection)
      assert.isTrue(res4.status)
      const res5 = await Thread.readThreadUsingId(res2.threadId, app.locals.threadCollection)
      assert.equal(res5.thread.replies.length, 0)
    })
    it('Read all tags', async function () {
      const draft = { content: 'draft content', title: 'draft title', tags: ['#google', '#noob'] }
      const author1 = new bson.ObjectID(bson.ObjectID.generate())
      const res1 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection, app.locals.tagCollection)
      assert.isTrue(res1.status)
      const user = new User({ _id: author1 })
      const res2 = await user.publishDraft(res1.draftId, app.locals.userCollection, app.locals.threadCollection)
      assert.isTrue(res2.status)
      const res3 = await Thread.readTags(app.locals.tagCollection)

      assert.isTrue(res3.status)
    })
  })
})
