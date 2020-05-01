const bson = require('bson')
const logger = require('../../logging/logger')

class Reply {
  constructor (object) {
    this._id = object._id
    this.threadId = object.threadId
    this.content = object.content
    this.author = object.author
    this.upvotes = object.upvotes
    this.downvotes = object.downvotes
    this.dateTime = object.dateTime
    this.lastUpdate = object.lastUpdate
    this.upvotesCount = object.upvotesCount
    this.downvotesCount = object.downvotesCount
    this.replies = object.replies
  }

  static async createReply (reply, id, threadCollection, replyCollection) {
    let response
    reply.upvotes = []
    reply.replyId = id.replyId
    reply.threadId = id.threadId
    reply.downvotes = []
    reply.upvotesCount = 0
    reply.downvotesCount = 0
    reply.reports = []
    reply.replies = []

    let filter

    try {
      reply._id = new bson.ObjectID(bson.ObjectId.generate())
      reply.dateTime = Date.now()
      reply.lastUpdate = Date.now()
      const query = {
        $push: {
          replies: reply._id
        }
      }
      let res
      if (id.threadId && !id.replyId) {
        filter = { _id: bson.ObjectID.createFromHexString(id.threadId) }
        res = await threadCollection.updateOne(filter, query)
      } else if (id.replyId) {
        filter = { _id: bson.ObjectID.createFromHexString(id.replyId) }
        res = await replyCollection.updateOne(filter, query)
      } else {
        return { status: false, msg: 'threadId or replyId missing' }
      }
      if (res.modifiedCount !== 1) {
        response = {
          status: false,
          msg: `Unable to create a reply for thread:${id.threadId} reply:${id.reply.threadId} replyId:${reply._id}`
        }
        logger.debug(response.msg)
      } else {
        res = await replyCollection.insertOne(reply)
        response = {
          status: true,
          msg: 'success',
          replyId: reply._id.toHexString()
        }
        logger.debug(`New reply for thread:${id.threadId}  reply:${id.replyId} replyId:${reply._id}`)
      }
    } catch (e) {
      response = {
        status: false,
        err: e
      }
      logger.error(`error reply for thread:${id.threadId}  reply:${id.replyId} replyId:${reply._id}`, e)
    }
    return response
  }

  static async updateReplyContent (reply, userId, replyCollection) {
    let response
    try {
      reply.author = bson.ObjectID.createFromHexString(userId)
      const filter = {
        _id: reply._id,
        author: reply.author
      }
      const res = await replyCollection.updateOne(filter, { $set: reply })
      if (res.modifiedCount !== 1) {
        response = {
          status: false,
          msg: `Unable to update content for reply a reply for replyId:${reply._id}`
        }
        logger.debug(response.msg)
      } else {
        response = {
          status: true,
          msg: 'success',
          replyId: reply._id.toHexString()
        }
        logger.debug(`Updated reply for replyId:${reply._id}`)
      }
    } catch (e) {
      response = {
        status: false,
        err: e
      }
      logger.error(`Unable to update reply for replyId:${reply._id}`)
    }
    return response
  }

  static async deleteReply (replyId, id, threadCollection, replyCollection) {
    let response
    try {
      let filter
      let res

      const query = {
        $pull: { replies: bson.ObjectID.createFromHexString(replyId) }
      }
      if (id.threadId) {
        filter = { _id: bson.ObjectID.createFromHexString(id.threadId) }
        res = await threadCollection.updateOne(filter, query)
      } else if (id.replyId) {
        filter = { _id: bson.ObjectID.createFromHexString(id.replyId) }
        res = await replyCollection.updateOne(filter, query)
      } else {
        return { status: false, msg: 'threadId or replyId missing' }
      }
      if (res.modifiedCount !== 1) {
        response = {
          status: false,
          msg: `Unable to delete reply thread:${id.threadId} reply:${id.replyId} replyId:${replyId}`
        }
        logger.debug(response.msg)
      } else {
        await replyCollection.deleteOne({ _id: bson.ObjectID.createFromHexString(replyId) })
        response = {
          status: true,
          msg: 'success',
          replyId: replyId
        }
        logger.debug(`deleted reply for thread:${id.threadId} reply:${id.replyId} replyId:${replyId}`)
      }
    } catch (e) {
      response = {
        status: false,
        err: e
      }
      logger.error(`Unable to delete reply for thread:${id.threadId} reply:${id.replyId}`, e)
    }
    return response
  }

  static async readReply (replyId, replyCollection, userId) {
    try {
      const filter = {
        _id: bson.ObjectID.createFromHexString(replyId)
      }

      let projection
      if (userId) {
        projection = {
          _id: 1,
          content: 1,
          title: 1,
          tags: 1,
          replies: 1,
          reports: 1,
          dateTime: 1,
          upvotesCount: 1,
          downvotesCount: 1,
          stars: 1,
          lastUpdate: 1,
          upvotes: { $elemMatch: { $eq: bson.ObjectID.createFromHexString(userId) } },
          downvotes: { $elemMatch: { $eq: bson.ObjectID.createFromHexString(userId) } },
          authorName: 1
        }
      } else {
        projection = {
          _id: 1,
          content: 1,
          title: 1,
          tags: 1,
          replies: 1,
          reports: 1,
          dateTime: 1,
          upvotesCount: 1,
          downvotesCount: 1,
          stars: 1,
          lastUpdate: 1,
          authorName: 1
        }
      }
      const reply = await replyCollection.findOne(filter, { projection: projection })
      if (reply) {
        return { status: true, reply: reply }
      } else {
        logger.debug(`no user found for user:${replyId}`)
        return { status: false }
      }
    } catch (e) {
      logger.debug(`error in finding user:${replyId}`, e)
      return { status: false, err: e }
    }
  }

  static async addReplyUpvote (replyId, userId, replyCollection) {
    const filter = {
      _id: bson.ObjectID.createFromHexString(replyId)
    }
    const query = {
      $addToSet: { upvotes: bson.ObjectID.createFromHexString(userId) },
      $inc: { upvotesCount: 1 }
    }
    let response
    try {
      const res = await replyCollection.updateOne(filter, query)
      if (res.modifiedCount !== 1) {
        response = {
          status: false,
          msg: `Unable to add upvote for reply replyId:${replyId}`
        }
        logger.debug(response.msg)
      } else {
        response = {
          status: true,
          msg: 'success',
          replyId: replyId
        }
        logger.debug(`Added upvote for reply for replyId:${replyId}`)
      }
    } catch (e) {
      response = {
        status: false,
        err: e
      }
      logger.error(`Unable add upvote for reply for replyId:${replyId}`)
    }
    return response
  }

  static async addReplyDownvote (replyId, userId, replyCollection) {
    const filter = {
      _id: bson.ObjectID.createFromHexString(replyId)
    }
    const query = {
      $addToSet: { downvotes: bson.ObjectID.createFromHexString(userId) },
      $inc: { downvotesCount: 1 }
    }
    let response
    try {
      const res = await replyCollection.updateOne(filter, query)
      if (res.modifiedCount !== 1) {
        response = {
          status: false,
          msg: `Unable to add downvote for reply replyId:${replyId}`
        }
        logger.debug(response.msg)
      } else {
        response = {
          status: true,
          msg: 'success',
          replyId: replyId
        }
        logger.debug(`Added downvote for reply for replyId:${replyId}`)
      }
    } catch (e) {
      response = {
        status: false,
        err: e
      }
      logger.error(`Unable add downvote for reply for replyId:${replyId}`)
    }
    return response
  }

  static async removeReplyUpvote (replyId, userId, replyCollection) {
    const user = bson.ObjectID.createFromHexString(userId)
    const filter = {
      _id: bson.ObjectID.createFromHexString(replyId),
      upvotes: user
    }

    const query = {
      $pull: { upvotes: user },
      $inc: { upvotesCount: -1 }
    }
    let response
    try {
      const res = await replyCollection.updateOne(filter, query)
      if (res.modifiedCount !== 1) {
        response = {
          status: false,
          msg: `Unable to remove upvote for reply replyId:${replyId}`
        }
        logger.debug(response.msg)
      } else {
        response = {
          status: true,
          msg: 'success',
          replyId: replyId
        }
        logger.debug(`remove upvote for reply for replyId:${replyId}`)
      }
    } catch (e) {
      response = {
        status: false,
        err: e
      }
      logger.error(`Unable to remove upvote for reply for replyId:${replyId}`)
    }
    return response
  }

  static async removeReplyDownvote (replyId, userId, replyCollection) {
    const user = bson.ObjectID.createFromHexString(userId)
    const filter = {
      _id: bson.ObjectID.createFromHexString(replyId),
      downvotes: user
    }
    const query = {
      $pull: { downvotes: user },
      $inc: { downvotesCount: -1 }
    }
    let response
    try {
      const res = await replyCollection.updateOne(filter, query)
      if (res.modifiedCount !== 1) {
        response = {
          status: false,
          msg: `Unable to remove downvote for reply replyId:${replyId}`
        }
        logger.debug(response.msg)
      } else {
        response = {
          status: true,
          msg: 'success',
          replyId: replyId
        }
        logger.debug(`remove downvote for reply for replyId:${replyId}`)
      }
    } catch (e) {
      response = {
        status: false,
        err: e
      }
      logger.error(`Unable remove downvote for reply for replyId:${replyId}`)
    }
    return response
  }
}

module.exports = Reply
