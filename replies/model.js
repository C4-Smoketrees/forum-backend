const mongoose = require("mongoose");

const schema = mongoose.Schema;
const objectId = schema.ObjectId;

// Embedded Documents
const Report = require("../reports/model");

const ReplySchema = new schema({
    content: {type: String},
    author: {type: objectId},           // userId
    upvotes: {type: [objectId]},        // userIds
    downvotes: {type: [objectId]},      // userIds
    dateTime: {type: Date},
    reports: {type: [Report]}
});

module.exports = mongoose.Model("Reply", ReplySchema);