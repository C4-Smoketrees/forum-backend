const mongoose = import("mongoose");

const schema = mongoose.Schema;
const objectId = schema.ObjectId;



const ThreadSchema = new schema({
    threadId: {type: objectId},
    title: {type: String},
    content: {type: String},
    tags: {type: [String]},
    replies: {type: [Replies]},
    reports: {type: [Reports]},
    dateTime: {type: Date},
    upvotes: {type: [VoteResponse]},
    downvotes: {type: [VoteResponse]},
    author: {type: User},
    stars: {type: Number}
});

module.exports = mongoose.model('Thread', ThreadSchema);