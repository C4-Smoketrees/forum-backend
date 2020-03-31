const ObjectId = require('bson').ObjectID
const logger = require('../../logging/logger')
const Thread = require('../threads/model')
const Reply = require('../replies/model')

/**
 * User class represents the business logic
 */
class User {
  constructor (object) {
    this._id = object._id
    this.stars = object.stars
    this.threads = object.threads
    this.replies = object.replies
    this.drafts = object.drafts
  }

  /**
   *
   * @param {string} userId
   * @param {{content:string,title:string,_id?:ObjectId,tags:string[]}} draft
   * @param {Collection} userCollection
   * @returns {Promise<void>}
   */
  static async createDraft (userId, draft, userCollection) {
    let response
    try {
      draft._id = new ObjectId(ObjectId.generate())
      const filter = { _id: ObjectId.createFromHexString(userId) }
      const query = { $push: { drafts: draft } }
      const res = await userCollection.updateOne(filter, query, { upsert: true })
      if (res.modifiedCount === 1) {
        response = { status: true, draftId: draft._id.toHexString() }
        logger.debug(`Created a draft for user:${userId} draftId:${draft._id.toHexString()}`)
      } else {
        response = { status: true, draftId: draft._id.toHexString(), userId: res.upsertedId._id.toHexString() }
        logger.debug(`Created a draft for user:${userId} draftId:${draft._id.toHexString()}`)
      }
    } catch (e) {
      response = { status: false, err: e }
      logger.error(`Error in creating a draft for user:${userId}`)
    }
    return response
  }

  static async updateDraft (userId, draft, userCollection) {
    let response
    try {
      const filter = {
        _id: ObjectId.createFromHexString(userId),
        drafts: { $elemMatch: { _id: draft._id } }
      }
      const query = {
        $set: {
          'drafts.$.content': draft.content,
          'drafts.$.title': draft.title,
          'drafts:$.tags': draft.tags
        }
      }
      const res = await userCollection.updateOne(filter, query)
      if (res.modifiedCount === 1) {
        response = { status: true, draftId: draft._id }
        logger.debug(`updated a draft for user:${userId} draftId:${draft._id.toHexString()}`)
      } else {
        response = { status: false, res: res }
        logger.debug(`Unable to update a draft for user:${userId} draft:${draft._id.toHexString()}`)
      }
    } catch (e) {
      response = { status: false, err: e }
      logger.error(`Error in updating a draft for user:${userId}`)
    }
    return response
  }

  static async readDraft (userId, draftId, userCollection) {
    let response
    try {
      const filter = {
        _id: ObjectId.createFromHexString(userId),
        drafts: { $elemMatch: { _id: ObjectId.createFromHexString(draftId) } }
      }
      const projection = {
        drafts: { $elemMatch: { _id: ObjectId.createFromHexString(draftId) } }
      }
      const res = await userCollection.findOne(filter, { projection: projection })
      if (res) {
        response = { status: true, draft: res.drafts[0] }
        return response
      }
      response = { status: false }
    } catch (e) {
      response = { status: false, err: e }
      logger.error(`Error in reading a draft for user:${userId}`)
    }
    return response
  }

  static async deleteDraft (userId, draftId, userCollection) {
    let response
    try {
      const filter = { _id: ObjectId.createFromHexString(userId) }
      const query = {
        $pull: { drafts: { _id: ObjectId.createFromHexString(draftId) } }
      }
      const res = await userCollection.updateOne(filter, query)
      if (res.modifiedCount === 1) {
        response = { status: true, draftId: draftId }
        logger.debug(`Deleted a draft for user:${userId} draftId:${draftId}`)
      } else {
        response = { status: false, draftId: draftId, res: res }
        logger.debug(`Unable to delete draft for user:${userId} draftId:${draftId}`)
      }
    } catch (e) {
      response = { status: false, err: e }
      logger.error(`Error in deleting a draft for user:${userId}`)
    }
    return response
  }

  async publishDraft (draftId, userCollection, threadCollection) {
    const draft = (await User.readDraft(this._id.toHexString(), draftId, userCollection)).draft
    console.log(draft)
    console.log(draft)
    const thread = new Thread({
      content: draft.content,
      title: draft.title,
      author: this._id
    })
    let response
    const res = await Thread.createThread(thread, threadCollection)
    if (!res.status) {
      if (res.err) {
        response = { status: false, msg: 'error occurred', err: res.err }
      }
      response = { status: false }
      return response
    }
    try {
      const filter = { _id: this._id }
      const query = { $push: { threads: thread._id } }
      const res2 = await userCollection.updateOne(filter, query, { upsert: true })
      if (res2.modifiedCount !== 1) {
        logger.error('Error in publishing draft(adding to the user threads)', {
          query: query,
          filter: filter,
          response: res2
        })
        response = { status: false, msg: 'Error in adding to user threads' }
      }
      response = { status: true, threadId: thread._id.toHexString(), draftId: draft._id.toHexString() }
    } catch (e) {
      response = { status: false, err: e }
      return response
    }
    const res3 = await User.deleteDraft(this._id.toHexString(), draftId, userCollection)
    if (!res3.status) {
      if (res3.err) {
        response = { status: false, err: res3.err }
      } else {
        response = { status: false, res: res3.res }
      }
      return response
    }
    return response
  }

  async deleteThread (threadId, userCollection, threadCollection) {
    const res = await Thread.deleteThreadUsingId(threadId, threadCollection)
    if (!res.status) {
      return { status: false }
    }
    try {
      const filter = { _id: this._id }
      const update = { $pull: { threads: ObjectId.createFromHexString(threadId) } }
      const res2 = await userCollection.updateOne(filter, update)
      if (res2.modifiedCount !== 1) {
        return { status: false }
      }
    } catch (e) {
      logger.error('Error in deleting thread from the user collection', { err: e })
      return { status: false }
    }
    return { status: true }
  }

  async addStar (threadId, userCollection, threadCollection) {
    const res = await Thread.updateStars(threadId, 'inc', threadCollection)
    if (!res.status) {
      return { status: false }
    }
    try {
      const filter = { _id: this._id }
      const update = { $push: { stars: ObjectId.createFromHexString(threadId) } }
      const res2 = await userCollection.updateOne(filter, update)
      if (res2.modifiedCount !== 1) {
        return { status: false }
      }
    } catch (e) {
      logger.error('Error in adding stars from the user collection', { err: e })
      return { status: false }
    }
    return { status: true }
  }

  async removeStar (threadId, userCollection, threadCollection) {
    const res = await Thread.updateStars(threadId, 'dec', threadCollection)
    if (!res.status) {
      return { status: false }
    }
    try {
      const filter = { _id: this._id }
      const update = { $pull: { stars: ObjectId.createFromHexString(threadId) } }
      const res2 = await userCollection.updateOne(filter, update)
      if (res2.modifiedCount !== 1) {
        return { status: false }
      }
    } catch (e) {
      logger.error('Error in removing stars from the user collection', { err: e })
      return { status: false }
    }
    return { status: true }
  }

  static async getUser (userId, userCollection) {
    try {
      const filter = { _id: ObjectId.createFromHexString(userId) }
      const res = await userCollection.findOne(filter)
      if (res) {
        logger.debug(`read user: ${userId}`)
        return { status: true, user: res }
      }
      logger.debug(`No user found for userId:${userId}`)
      return { status: false, err: `No user found for userId:${userId}` }
    } catch (e) {
      logger.debug(`Error occurred while reading user:${userId}`, { err: e })
      return { status: false, err: e }
    }
  }

  /**
   *
   * @param {Reply} reply
   * @param {string} threadId
   * @param userCollection
   * @param threadCollection
   * @returns {Promise<{status: boolean}>}
   */
  async addReply (reply, threadId, userCollection, threadCollection) {
    const res1 = await Reply.createReply(reply, threadId, threadCollection)
    if (!res1.status) {
      return { status: false }
    }
    const replyId = res1.replyId
    try {
      const filter = { _id: this._id }
      const update = { $push: { replies: ObjectId.createFromHexString(replyId) } }
      const res2 = await userCollection.updateOne(filter, update)
      if (res2.modifiedCount !== 1) {
        return { status: false }
      }
    } catch (e) {
      logger.error(`Error in adding reply to user:${this._id.toHexString()} replyId:${replyId}`)
      return { status: false }
    }
    return { status: true }
  }

  async deleteReply (replyId, threadId, userCollection, threadCollection) {
    const res1 = await Reply.deleteReply(threadId, replyId, threadCollection)
    if (!res1.status) {
      return { status: false }
    }
    try {
      const filter = { _id: this._id }
      const update = { $push: { replies: ObjectId.createFromHexString(replyId) } }
      const res2 = await userCollection.updateOne(filter, update)
      if (res2.modifiedCount !== 1) {
        return { status: false }
      }
    } catch (e) {
      logger.error(`Error in adding reply to user:${this._id.toHexString()} replyId:${replyId}`)
      return { status: false }
    }
    return { status: true }
  }
}

module.exports = User
