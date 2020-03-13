const mongoose = require('mongoose')

const Schema = mongoose.Schema
const objectId = mongoose.ObjectId

const ReportSchema = new Schema({
  userId: { type: objectId },
  reportReasons: { type: Number }
}, { _id: false })

module.exports = mongoose.model('Report', ReportSchema)
