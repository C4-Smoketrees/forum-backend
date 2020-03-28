const bson = require('bson')
const logger = require('../../logging/logger')

class Reply {
  constructor (object) {
    this._id = object._id
    this.content = object.content
    this.author = object.author
    this.upvotes = object.upvotes
    this.downvotes = object.downvotes
    this.dateTime = object.dateTime
    this.reports = object.reports
  }

  async createReply (threadId, threadCollection) {
    let response
    this.upvotes = []
    this.downvotes = []
    this.reports = []
    try {
      const filter = {
        _id: bson.ObjectID.createFromHexString(threadId)
      }
      this._id = new bson.ObjectID(bson.ObjectId.generate())
      this.dateTime = Date.now()
      const query = {
        $push: {
          replies: this
        }
      }
      const res = await threadCollection.updateOne(filter, query)
      if (res.modifiedCount !== 1) {
        response = {
          status: false,
          msg: `Unable to create a reply for thread:${threadId} replyId:${this._id}`
        }
        logger.debug(response.msg)
      } else {
        response = {
          status: true,
          msg: 'success',
          replyId: this._id.toHexString()
        }
        logger.debug(`New reply for thread:${threadId} replyId:${this._id}`)
      }
    } catch (e) {
      response = {
        status: false,
        err: e
      }
    }
    return response
  }

  async updateReplyContent (threadId, threadCollection) {
    let response
    try {
      const filter = {
        _id: bson.ObjectID.createFromHexString(threadId),
        replies: { $elemMatch: { _id: this._id } }
      }
      const query = {
        $set: {
          'replies.$.content': this.content
        }
      }
      const res = await threadCollection.updateOne(filter, query)
      if (res.modifiedCount !== 1) {
        response = {
          status: false,
          msg: `Unable to update content for reply a reply for thread:${threadId} replyId:${this._id}`
        }
        logger.debug(response.msg)
      } else {
        response = {
          status: true,
          msg: 'success',
          replyId: this._id.toHexString()
        }
        logger.debug(`Updated reply for thread:${threadId} replyId:${this._id}`)
      }
    } catch (e) {
      response = {
        status: false,
        err: e
      }
      logger.error(`Unable to update reply for threadId:${threadId}`)
    }
    return response
  }

  static async deleteReply (threadId, replyId, threadCollection) {
    let response
    try {
      const filter = {
        _id: bson.ObjectID.createFromHexString(threadId)
      }
      const query = {
        $pull: { replies: { _id: bson.ObjectID.createFromHexString(replyId) } }
      }
      const res = await threadCollection.updateOne(filter, query)
      if (res.modifiedCount !== 1) {
        response = {
          status: false,
          msg: `Unable to delete reply thread:${threadId} replyId:${replyId}`
        }
        logger.debug(response.msg)
      } else {
        response = {
          status: true,
          msg: 'success',
          replyId: replyId
        }
        logger.debug(`deleted reply for thread:${threadId} replyId:${replyId}`)
      }
    } catch (e) {
      response = {
        status: false,
        err: e
      }
      logger.error(`Unable to delete reply for threadId:${threadId}`)
    }
    return response
  }

  static async addReplyUpvote (threadId, replyId, userId, threadCollection) {
    const filter = {
      _id: bson.ObjectID.createFromHexString(threadId),
      replies: { $elemMatch: { _id: bson.ObjectID.createFromHexString(replyId) } }
    }
    const query = {
      $addToSet: { 'replies.$.upvotes': bson.ObjectID.createFromHexString(userId) }
    }
    let response
    try {
      const res = await threadCollection.updateOne(filter, query)
      if (res.modifiedCount !== 1) {
        response = {
          status: false,
          msg: `Unable to add upvote for reply for thread:${threadId} replyId:${replyId}`
        }
        logger.debug(response.msg)
      } else {
        response = {
          status: true,
          msg: 'success',
          replyId: replyId
        }
        logger.debug(`Added upvote for reply for thread:${threadId} replyId:${replyId}`)
      }
    } catch (e) {
      response = {
        status: false,
        err: e
      }
      logger.error(`Unable add upvote for reply for threadId:${threadId}`)
    }
    return response
  }

  static async addReplyDownvote (threadId, replyId, userId, threadCollection) {
    const filter = {
      _id: bson.ObjectID.createFromHexString(threadId),
      replies: { $elemMatch: { _id: bson.ObjectID.createFromHexString(replyId) } }
    }
    const query = {
      $addToSet: { 'replies.$.downvotes': bson.ObjectID.createFromHexString(userId) }
    }
    let response
    try {
      const res = await threadCollection.updateOne(filter, query)
      if (res.modifiedCount !== 1) {
        response = {
          status: false,
          msg: `Unable to add downvote for reply for thread:${threadId} replyId:${replyId}`
        }
        logger.debug(response.msg)
      } else {
        response = {
          status: true,
          msg: 'success',
          replyId: replyId
        }
        logger.debug(`Added downvote for reply for thread:${threadId} replyId:${replyId}`)
      }
    } catch (e) {
      response = {
        status: false,
        err: e
      }
      logger.error(`Unable add downvote for reply for threadId:${threadId}`)
    }
    return response
  }

  static async removeReplyUpvote (threadId, replyId, userId, threadCollection) {
    const filter = {
      _id: bson.ObjectID.createFromHexString(threadId),
      replies: { $elemMatch: { _id: bson.ObjectID.createFromHexString(replyId) } }
    }
    const query = {
      $pull: { 'replies.$.upvotes': bson.ObjectID.createFromHexString(userId) }
    }
    let response
    try {
      const res = await threadCollection.updateOne(filter, query)
      if (res.modifiedCount !== 1) {
        response = {
          status: false,
          msg: `Unable to remove upvote for reply for thread:${threadId} replyId:${replyId}`
        }
        logger.debug(response.msg)
      } else {
        response = {
          status: true,
          msg: 'success',
          replyId: replyId
        }
        logger.debug(`Removed upvote for reply for thread:${threadId} replyId:${replyId}`)
      }
    } catch (e) {
      response = {
        status: false,
        err: e
      }
      logger.error(`Unable remove upvote for reply for threadId:${threadId}`)
    }
    return response
  }

  static async removeReplyDownvote (threadId, replyId, userId, threadCollection) {
    const filter = {
      _id: bson.ObjectID.createFromHexString(threadId),
      replies: { $elemMatch: { _id: bson.ObjectID.createFromHexString(replyId) } }
    }
    const query = {
      $pull: { 'replies.$.downvotes': bson.ObjectID.createFromHexString(userId) }
    }
    let response
    try {
      const res = await threadCollection.updateOne(filter, query)
      if (res.modifiedCount !== 1) {
        response = {
          status: false,
          msg: `Unable to remove downvote for reply for thread:${threadId} replyId:${replyId}`
        }
        logger.debug(response.msg)
      } else {
        response = {
          status: true,
          msg: 'success',
          replyId: replyId
        }
        logger.debug(`Removed downvote for reply for thread:${threadId} replyId:${replyId}`)
      }
    } catch (e) {
      response = {
        status: false,
        err: e
      }
      logger.error(`Unable remove downvote for reply for threadId:${threadId}`)
    }
    return response
  }
}

module.exports = Reply
