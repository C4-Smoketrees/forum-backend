const draft = require('./draft')
const reply = require('./reply')
const report = require('./report')
const thread = require('./thread')

const ForumClient = function () {
}

ForumClient.prototype.newDraft = draft.newDraft
ForumClient.prototype.updateDraft = draft.updateDraft
ForumClient.prototype.getOneDraft = draft.getOneDraft
ForumClient.prototype.getAllDraft = draft.getAllDraft
ForumClient.prototype.deleteDraft = draft.deleteDraft
ForumClient.prototype.publishDraft = draft.publishDraft

ForumClient.prototype.getReply = reply.getReply
ForumClient.prototype.newReply = reply.newReply
ForumClient.prototype.updateReply = reply.updateReply
ForumClient.prototype.upvoteReply = reply.upvoteReply
ForumClient.prototype.downvoteReply = reply.downvoteReply
ForumClient.prototype.removeUpvoteReply = reply.removeUpvoteReply
ForumClient.prototype.removeDownvoteReply = reply.removeDownvoteReply

ForumClient.prototype.replyReport = report.replyReport
ForumClient.prototype.threadReport = report.threadReport

ForumClient.prototype.starThread = thread.starThread
ForumClient.prototype.unstarThread = thread.unstarThread
ForumClient.prototype.getOneThread = thread.getOneThread
ForumClient.prototype.getAllThread = thread.getAllThread
ForumClient.prototype.deleteThread = thread.deleteThread
ForumClient.prototype.updateThread = thread.updateThread
ForumClient.prototype.upvoteThread = thread.upvoteThread
ForumClient.prototype.downvoteThread = thread.downvoteThread
ForumClient.prototype.removeUpvoteThread = thread.removeUpvoteThread
ForumClient.prototype.removeDownvoteThread = thread.removeDownvoteThread

module.exports = new ForumClient()
