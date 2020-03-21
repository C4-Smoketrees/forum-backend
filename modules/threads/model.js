class Thread {
  constructor (object) {
    this._id = object._id
    this.content = object.content
    this.replies = object.replies
    this.reports = object.reports
    this.dateTime = object.dateTime
    this.upvotes = object.upvotes
    this.downvotes = object.downvotes
    this.author = object.author
    this.stars = object.stars
  }
}

module.exports = Thread
