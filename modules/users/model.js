const ObjectId = require('bson').ObjectID
const logger = require('../../logging/logger')

/**
 * User class represents the business logic
 */
class User {
  constructor (object) {
    this._id = object._id
    this.stars = object._id
    this.posts = object._id
    this.replies = object._id
    this.drafts = object._id
  }

  /**
   *
   * @param {string} userId
   * @param {{content:string,title:string}} draft
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
        response = { status: true, draftId: draft._id }
        logger.debug(`Created a draft for user:${userId} draftId:${draft._id.toHexString()}`)
      } else {
        response = { status: true, draftId: draft._id, userId: res.upsertedId._id.toHexString() }
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
      const query = { $set: { 'drafts.$.content': draft.content, 'drafts.$.title': draft.title } }
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

  static publishDraft (draftId) {
  }

  static async addStar () {
  }

  static async reply () {
  }
}

module
  .exports = User
