class Reply {
  constructor (object) {
    this.content = object.content
    this.content = object.author
    this.upvotes = object.upvotes
    this.downvotes = object.downvotes
    this.dateTime = object.dateTime
    this.reports = object.reports
  }
}

module.exports = Reply
