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
  }

  static async readReplies (threadId, threadCollection) {
  }

  static async AddReplyUpvote () {
  }

  static async AddReplyDownvote () {
  }

  static async RemoveReplyDownvote () {
  }

  static async RemoveReplyUpvote () {
  }
}

module.exports = Reply
