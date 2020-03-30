const { assert } = require('chai')
const { describe, it, before, after } = require('mocha')
const app = require('../app')
const User = require('../modules/users/model')
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
        const draft = { content: 'new draft content', title: 'new draft title' }
        const author1 = new bson.ObjectID(bson.ObjectID.generate())
        const res1 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection)
        assert.isTrue(res1.status)
        draft.title = 'draft title2'
        draft.content = 'draft content2'
        const res2 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection)
        assert.isTrue(res2.status)
      } catch (e) {
        console.log(e)
        assert.isTrue(false)
      }
    })
    it('Update a draft', async function () {
      try {
        const draft = { content: 'draft content', title: 'draft title' }
        const author1 = new bson.ObjectID(bson.ObjectID.generate())
        const res1 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection)
        assert.isTrue(res1.status)
        draft._id = bson.ObjectID.createFromHexString(res1.draftId)
        draft.title = 'draft title2'
        draft.content = 'draft content2'
        const res2 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection)
        assert.isTrue(res2.status)
        draft._id = bson.ObjectID.createFromHexString(res1.draftId)
        draft.title = 'update draft'
        draft.content = 'update draft content2'
        const res3 = await User.updateDraft(author1.toHexString(), draft, app.locals.userCollection)
        assert.isTrue(res3.status)
      } catch (e) {
        console.log(e)
        assert.isTrue(false)
      }
    })
    it('read a draft', async function () {
      try {
        const draft = { content: 'draft content', title: 'draft title' }
        const author1 = new bson.ObjectID(bson.ObjectID.generate())
        const res1 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection)
        assert.isTrue(res1.status)
        draft.content = 'draft content 2'
        draft.title = 'draft title 2'
        const res2 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection)
        assert.isTrue(res2.status)
        const res3 = await User.readDraft(author1.toHexString(), res2.draftId, app.locals.userCollection)
        if (res3.draft.content !== 'draft content 2') {
          assert.isTrue(false)
        }
      } catch (e) {
        console.log(e)
        assert.isTrue(false)
      }
    })
    it('Delete a draft', async function () {
      const draft = { content: 'delete draft content', title: 'delete draft title' }
      const author1 = new bson.ObjectID(bson.ObjectID.generate())
      const res1 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection)
      assert.isTrue(res1.status)
      const res2 = await User.deleteDraft(author1.toHexString(), draft._id.toHexString(), app.locals.userCollection)
      assert.isTrue(res2.status)
      const res3 = await User.deleteDraft(author1.toHexString(), draft._id.toHexString(), app.locals.userCollection)
      assert.isFalse(res3.status)
    })
    it('Publish a draft', async function () {
      const draft = { content: 'draft content', title: 'draft title' }
      const author1 = new bson.ObjectID(bson.ObjectID.generate())
      const res1 = await User.createDraft(author1.toHexString(), draft, app.locals.userCollection)
      assert.isTrue(res1.status)
      const user = new User({ _id: author1 })
      const res2 = await user.publishDraft(res1.draftId, app.locals.userCollection, app.locals.threadCollection)
      console.log(res2)
      assert.isTrue(res2.status)
    })
  })
})
