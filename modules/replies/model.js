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
    this.upvotesCount = object.upvotesCount
    this.downvotesCount = object.downvotesCount
    this.reports = object.reports
  }

  static async createReply (reply, threadId, threadCollection) {
    let response
    reply.upvotes = []
    reply.downvotes = []
    reply.upvotesCount = 0
    reply.downvotesCount = 0
    reply.reports = []
    try {
      const filter = {
        _id: bson.ObjectID.createFromHexString(threadId)
      }
      reply._id = new bson.ObjectID(bson.ObjectId.generate())
      reply.dateTime = Date.now()
      const query = {
        $push: {
          replies: reply
        }
      }
      const res = await threadCollection.updateOne(filter, query)
      if (res.modifiedCount !== 1) {
        response = {
          status: false,
          msg: `Unable to create a reply for thread:${threadId} replyId:${reply._id}`
        }
        logger.debug(response.msg)
      } else {
        response = {
          status: true,
          msg: 'success',
          replyId: reply._id.toHexString()
        }
        logger.debug(`New reply for thread:${threadId} replyId:${reply._id}`)
      }
    } catch (e) {
      response = {
        status: false,
        err: e
      }
    }
    return response
  }

  static async updateReplyContent (reply, threadId, threadCollection) {
    let response
    try {
      const filter = {
        _id: bson.ObjectID.createFromHexString(threadId),
        replies: { $elemMatch: { _id: reply._id } }
      }
      const query = {
        $set: {
          'replies.$.content': reply.content
        }
      }
      const res = await threadCollection.updateOne(filter, query)
      if (res.modifiedCount !== 1) {
        response = {
          status: false,
          msg: `Unable to update content for reply a reply for thread:${threadId} replyId:${reply._id}`
        }
        logger.debug(response.msg)
      } else {
        response = {
          status: true,
          msg: 'success',
          replyId: reply._id.toHexString()
        }
        logger.debug(`Updated reply for thread:${threadId} replyId:${reply._id}`)
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

  static async deleteReply (replyId, threadId, threadCollection) {
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

  static async addReplyUpvote (replyId, threadId, userId, threadCollection) {
    const filter = {
      _id: bson.ObjectID.createFromHexString(threadId),
      replies: { $elemMatch: { _id: bson.ObjectID.createFromHexString(replyId) } }
    }
    let query = {
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
        query = { $inc: { 'replies.$.upvotesCount': 1 } }
        await threadCollection.updateOne(filter, query)
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

  static async addReplyDownvote (replyId, threadId, userId, threadCollection) {
    const filter = {
      _id: bson.ObjectID.createFromHexString(threadId),
      replies: { $elemMatch: { _id: bson.ObjectID.createFromHexString(replyId) } }
    }
    let query = {
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
        query = { $inc: { 'replies.$.downvotesCount': 1 } }
        await threadCollection.updateOne(filter, query)
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

  static async removeReplyUpvote (replyId, threadId, userId, threadCollection) {
    const filter = {
      _id: bson.ObjectID.createFromHexString(threadId),
      replies: { $elemMatch: { _id: bson.ObjectID.createFromHexString(replyId) } }
    }
    let query = {
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
        query = { $inc: { 'replies.$.upvotesCount': -1 } }
        await threadCollection.updateOne(filter, query)
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

  static async removeReplyDownvote (replyId, threadId, userId, threadCollection) {
    const filter = {
      _id: bson.ObjectID.createFromHexString(threadId),
      replies: { $elemMatch: { _id: bson.ObjectID.createFromHexString(replyId) } }
    }
    let query = {
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
        query = { $inc: { 'replies.$.downvotesCount': -1 } }
        await threadCollection.updateOne(filter, query)
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
