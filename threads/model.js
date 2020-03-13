const mongoose = require("mongoose");

const schema = mongoose.Schema;
const objectId = schema.ObjectId;

// Embedded Documents
Reply = require("../replies/model");
Report = require("../reports/model");

const ThreadSchema = new schema({
    title: {type: String},
    content: {type: String},
    tags: {type: [String]},
    replies: {type: [Reply]},
    reports: {type: [Report]},
    dateTime: {type: Date},
    upvotes: {type: [objectId]},        // userIds
    downvotes: {type: [objectId]},      // userIds
    author: {type: objectId},           // userId
    stars: {type: [objectId]}           // userIds
});

module.exports = mongoose.model('Thread', ThreadSchema);