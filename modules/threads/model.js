const bson = require('bson')
const app = require('../../app')
const logger = require('../../logging/logger')

class Thread {
  /**
   * Create an instance of thread
   * @param {Thread} thread Object representing the Thread
   * @param {bson.ObjectID} [thread._id] Id for the object
   * @param {string} thread.content Content for the Thread
   * @param {array(Replies)} [thread.replies] Replies array contains Replies
   * @param {array(Reports)} [thread.reports] Reports array contains Reports
   * @param {number} [thread.dateTime] Datetime
   * @param {array(bson.ObjectID)} [thread.upvotes] Upvotes array
   * @param {array(bson.ObjectID)} [thread.downvotes] Downvotes array
   * @param {bson.ObjectID} thread.author Author of the thread
   * @param {number} [thread.stars] Stars for the post
   */
  constructor (thread) {
    this._id = thread._id
    this.content = thread.content
    this.replies = thread.replies
    this.reports = thread.reports
    this.dateTime = thread.dateTime
    this.upvotes = thread.upvotes
    this.downvotes = thread.downvotes
    this.author = thread.author
    this.stars = thread.stars
  }

  newThread (fn) {
    try {
      const threadCollection = app.locals.dbClient.db('forum').collection('threads')
      // reference for thread is this
      this._id = new bson.ObjectID(bson.ObjectID.generate())
      console.log(this._id.toHexString())
      this.replies = []
      this.reports = []
      this.dateTime = Date.now()
      this.upvotes = []
      this.downvotes = []
      this.stars = 0
      let response
      threadCollection.insertOne(this).then(() => {
        response = {
          status: true,
          id: this._id
        }
        logger.debug(`Insert new thread with id:${response.id.toHexString()}`)
        fn(response)
      }, () => {
        response = { status: false }
        fn(response)
      })
    } catch (e) {
      logger.error('Error in creating new thread ', e)
    }
  }
}

module.exports = Thread
