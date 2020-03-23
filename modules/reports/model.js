const bson = require('bson')
const thread = require('Thread')

class Report {
  /**
   * Returns a Report Object
   * @param {{userId:bson.ObjectId,reportReason:number}} object
   */
  constructor (object) {
    this.userId = object.userId
    this.reportReason = object.reportReason
  }

  /**
   * Create Report for a post
   * @param {string} threadId
   * @param {Report} report
   * @return Promise
   */
  static createReport (threadId, report) {
    const func = async () => {
      try {
        const filter = { _id: bson.ObjectId.createFromHexString(threadId) }
        const thread = await Thread.readThreadUsingId()

      } catch (e) {

      }
    }
    return func()
  }
}

module.exports = Report
