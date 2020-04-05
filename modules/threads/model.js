const bson = require('bson')
const logger = require('../../logging/logger')

/**
 * @typedef {{status:boolean,id:string|undefined}} DatabaseWriteResponse
 * @typedef {{status:boolean,thread:Thread|undefined}} DatabaseReadResponse
 */

/**
 * Class representing a thread
 */
class Thread {
  /**
   * Create an instance of thread
   * @param {{author: ObjectId, content: string,title:string}} thread Object representing the Thread
   * @param {Thread} thread Object representing a thread
   * @param {string} thread.title Threads title
   * @param {bson.ObjectID=auto_generate} [thread._id] Id for the object
   * @param {string} thread.content Content for the Thread
   * @param {array(Replies)=[]} [thread.replies] Replies array contains Replies
   * @param {array(Reports)=[]} [thread.reports] Reports array contains Reports
   * @param {number=time.now()} [thread.dateTime] Datetime
   * @param {array(bson.ObjectID)=[]} [thread.upvotes] Upvotes array
   * @param {array(bson.ObjectID)=[]} [thread.downvotes] Downvotes array
   * @param {bson.ObjectID} thread.author Author of the thread
   * @param {number=0} [thread.stars] Stars for the post
   * @param {number=time.now()} thread.astUpdate Last updated
   */
  constructor (thread) {
    this._id = thread._id
    this.content = thread.content
    this.title = thread.title
    this.replies = thread.replies
    this.reports = thread.reports
    this.dateTime = thread.dateTime
    this.upvotesCount = thread.upvotesCount
    this.downvotesCount = thread.downvotesCount
    this.upvotes = thread.upvotes
    this.downvotes = thread.downvotes
    this.author = thread.author
    this.stars = thread.stars
    this.lastUpdate = thread.lastUpdate
    this.tags = thread.tags
  }

  /**
   * Creates a new thread in database
   * @param {Collection} threadCollection
   * @param {Thread} thread
   * @returns {Promise} returns a promise
   */
  static createThread (thread, threadCollection) {
    const func = async () => {
      try {
        thread._id = new bson.ObjectID(bson.ObjectID.generate())
        thread.replies = []
        thread.reports = []
        thread.dateTime = Date.now()
        thread.upvotes = []
        thread.downvotes = []
        thread.upvotesCount = 0
        thread.downvotesCount = 0
        thread.stars = 0
        thread.lastUpdate = Date.now()
        await threadCollection.insertOne(thread)
        const response = {
          status: true,
          threadId: thread._id.toHexString()
        }
        logger.debug(`Insert new thread with id:${response.threadId}`)
        return response
      } catch (e) {
        const response = { status: false, err: e }
        logger.error(` err new thread with id:${response.id}`, { err: e })
        return response
      }
    }
    return func()
  }

  /**
   * Update ThreadContent using _id property of the thread object
   * @param thread
   * @param userId
   * @param {Collection} threadCollection
   * @returns {Promise} A promise that always resolves
   */
  static updateThreadContent (thread, userId, threadCollection) {
    const filter = { _id: thread._id, author: bson.ObjectID.createFromHexString(userId) }
    thread.lastUpdate = Date.now()
    const query = {
      $set: {
        title: thread.title,
        content: thread.content,
        tags: thread.tags
      }
    }

    const func = async () => {
      try {
        const res = await threadCollection.updateOne(filter, query, {})
        let response
        if (res.modifiedCount === 1) {
          response = {
            status: true,
            threadId: thread._id.toHexString()
          }
          logger.debug(`Updated content for thread for id: ${response.threadId}`)
        } else {
          response = { status: false, id: thread._id.toHexString() }
          logger.error(JSON.stringify({ id: thread._id.toHexString(), matches: res.matchedCount }))
        }
        return response
      } catch (e) {
        const response = { status: false }
        logger.error(`Error in updating thread for id: ${thread._id}`)
        return response
      }
    }
    return func()
  }

  /**
   * Read and return a thread using id
   * @param {string} id HexString representing id of the thread
   * @param {Collection} threadCollection
   * @param {string} [userId]
   * @returns {Promise}  Promise always resolves
   */
  static readThreadUsingId (id, threadCollection, userId) {
    const objectId = bson.ObjectID.createFromHexString(id)
    const filter = { _id: objectId }
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
        downvotes: { $elemMatch: { $eq: bson.ObjectID.createFromHexString(userId) } }
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
        lastUpdate: 1
      }
    }
    const func = async () => {
      try {
        const dbRes = await threadCollection.findOne(filter, { projection: projection })
        const res = { status: true, thread: await dbRes }
        logger.debug(`Read thread with id: ${res.thread._id.toHexString()}`)
        return res
      } catch (e) {
        const res = { status: false }
        logger.error(JSON.stringify({ msg: `Error in reading the document with id : ${id}`, err: e }))
        return res
      }
    }
    return func()
  }

  static async readAllThreads (threadCollection, userId) {
    let projection
    if (userId) {
      projection = {
        _id: 1,
        content: 1,
        title: 1,
        tags: 1,
        'replies._id': 1,
        'replies.content': 1,
        'replies.upvotesCount': 1,
        'replies.downvotesCount': 1,
        'replies.title': 1,
        'replies.dateTime': 1,
        'replies.author': 1,
        reports: 1,
        dateTime: 1,
        upvotesCount: 1,
        downvotesCount: 1,
        stars: 1,
        lastUpdate: 1,
        upvotes: { $elemMatch: { $eq: bson.ObjectID.createFromHexString(userId) } },
        downvotes: { $elemMatch: { $eq: bson.ObjectID.createFromHexString(userId) } }
      }
    } else {
      projection = {
        _id: 1,
        content: 1,
        title: 1,
        tags: 1,
        'replies.id': 1,
        'replies.content': 1,
        reports: 1,
        dateTime: 1,
        upvotesCount: 1,
        downvotesCount: 1,
        stars: 1,
        lastUpdate: 1
      }
    }
    try {
      let doc
      const threads = []
      let length = 0
      const res = await threadCollection.find({}, { projection: projection })
      while (await res.hasNext()) {
        doc = await res.next()
        threads.push(doc)
        length += 1
      }
      return { status: true, threads: threads, length: length }
    } catch (e) {
      const res = { status: false }
      logger.error(JSON.stringify({ msg: 'Error in reading all threads', err: e }))
      return res
    }
  }

  /**
   * Delete a thread from the id
   * @param {string} id  HexString representing id of the thread
   * @param {Collection} threadCollection
   * @returns {Promise} Always resolves
   */
  static deleteThreadUsingId (id, threadCollection) {
    const objectId = bson.ObjectID.createFromHexString(id)
    const filter = { _id: objectId }
    const func = async () => {
      try {
        const res = await threadCollection.deleteOne(filter)
        let response
        if (res.deletedCount === 1) {
          response = { status: true, threadId: id }
          logger.debug(`Deleted thread id: ${id}`)
        } else {
          response = { status: false }
        }
        return response
      } catch (e) {
        const response = { status: false, err: e }
        logger.error(JSON.stringify({ msg: `Error in deleting the document of id : ${id}`, err: e }))
        return response
      }
    }
    return func()
  }

  static async readTags (tagCollection) {
    try {
      const res = await tagCollection.findOne({})
      if (!res) {
        return { status: false }
      }
      const tags = res.tags
      return { status: true, tags: tags }
    } catch (e) {
      logger.error('Error in reading the tags', { err: e })
      return { status: false, err: e }
    }
  }

  /**
   * Increment or Decrement stars of the thread
   * @param {string} id HexString representing the id
   * @param {string} command Either inc or dec
   * @param {Collection} threadCollection
   * @returns {Promise<DatabaseWriteResponse>} Promise always resolves
   */
  static updateStars (id, command, threadCollection) {
    const objectId = new bson.ObjectID(bson.ObjectID.createFromHexString(id))

    const filter = { _id: objectId }
    let query
    if (command === 'inc') {
      query = { $inc: { stars: 1 } }
    } else if (command === 'dec') {
      query = { $inc: { stars: -1 } }
    } else {
      throw new Error('Illegal Command')
    }

    const func = async () => {
      try {
        const result = await threadCollection.updateOne(filter, query)
        let response
        if (result.modifiedCount === 1) {
          response = { status: true, threadId: id }
          logger.debug(`Incremented star for the id: ${id}`)
        } else {
          response = { status: false, threadId: id }
          logger.warn(`Error in incrementing star for id: ${id} modified:${result.modifiedCount} match: ${result.matchedCount}`)
        }
        return response
      } catch (e) {
        const response = { status: false, err: e }
        logger.error(JSON.stringify({ msg: `Error in incrementing start for id : ${id}`, err: e }))
        return response
      }
    }

    return func()
  }

  static async readThreadByTag (tag, threadCollection) {
    try {
      const filter = { tags: tag }
      const res = await threadCollection.find(filter)
      const threads = []
      let doc
      while (await res.hasNext()) {
        doc = await res.next()
        threads.push(doc)
      }
      return { status: true, threads: threads }
    } catch (e) {
      const res = { status: false, err: e }
      logger.error(JSON.stringify({ msg: 'Error in reading all threads', err: e }))
      return res
    }
  }

  static async addUpvote (threadId, userId, threadCollection) {
    const filter = { _id: bson.ObjectID.createFromHexString(threadId) }
    let query = { $addToSet: { upvotes: bson.ObjectID.createFromHexString(userId) } }

    let response
    try {
      const res = await threadCollection.updateOne(filter, query)
      if (res.modifiedCount === 1) {
        query = { $inc: { upvotesCount: 1 } }
        await threadCollection.updateOne(filter, query)
        response = {
          status: true
        }
      } else {
        response = {
          status: false
        }
      }
    } catch (e) {
      response = {
        status: false,
        err: e
      }
      logger.error(`Error in upvoting thread: ${threadId} error:${e.message}`)
    }
    return response
  }

  static async addDownvote (threadId, userId, threadCollection) {
    const filter = { _id: bson.ObjectID.createFromHexString(threadId) }
    let query = { $addToSet: { downvotes: bson.ObjectID.createFromHexString(userId) } }

    let response
    try {
      const res = await threadCollection.updateOne(filter, query)
      if (res.modifiedCount === 1) {
        query = { $inc: { downvotesCount: 1 } }
        await threadCollection.updateOne(filter, query)
        response = {
          status: true
        }
      } else {
        response = {
          status: false
        }
      }
    } catch (e) {
      response = {
        status: false,
        err: e
      }
      logger.error(`Error in upvoting thread: ${threadId} error:${e.message}`)
    }
    return response
  }

  static async removeDownvote (threadId, userId, threadCollection) {
    const filter = { _id: bson.ObjectID.createFromHexString(threadId) }
    let query = { $pull: { downvotes: bson.ObjectID.createFromHexString(userId) } }

    let response
    try {
      const res = await threadCollection.updateOne(filter, query)
      if (res.modifiedCount === 1) {
        query = { $inc: { downvotesCount: -1 } }
        await threadCollection.updateOne(filter, query)
        response = {
          status: true
        }
      } else {
        response = {
          status: false
        }
      }
    } catch (e) {
      response = {
        status: false,
        err: e
      }
      logger.error(`Error in upvoting thread: ${threadId} error:${e.message}`)
    }
    return response
  }

  static async removeUpvote (threadId, userId, threadCollection) {
    const filter = { _id: bson.ObjectID.createFromHexString(threadId) }
    let query = { $pull: { upvotes: bson.ObjectID.createFromHexString(userId) } }

    let response
    try {
      const res = await threadCollection.updateOne(filter, query)
      if (res.modifiedCount === 1) {
        query = { $inc: { upvotesCount: -1 } }
        await threadCollection.updateOne(filter, query)
        response = {
          status: true
        }
      } else {
        response = {
          status: false
        }
      }
    } catch (e) {
      response = {
        status: false,
        err: e
      }
      logger.error(`Error in upvoting thread: ${threadId} error:${e.message}`)
    }
    return response
  }
}

module.exports = Thread
