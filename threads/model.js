const mongoose = require('mongoose')

const Schema = mongoose.Schema
const objectId = Schema.ObjectId

// Embedded Documents
const Reply = require('../replies/model')
const Report = require('../reports/model')

const ThreadSchema = new Schema({
  title: { type: String },
  content: { type: String },
  tags: { type: [String] },
  replies: { type: [Reply] },
  reports: { type: [Report] },
  dateTime: { type: Date },
  upvotes: { type: [objectId] }, // userIds
  downvotes: { type: [objectId] }, // userIds
  author: { type: objectId }, // userId
  stars: { type: [objectId] } // userIds
})

module.exports = mongoose.model('Thread', ThreadSchema)
