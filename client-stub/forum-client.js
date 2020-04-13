const draft = require('./draft')
const reply = require('./reply')
const report = require('./report')
const thread = require('./thread')

const ForumClient = function () {
}

/**
 * User
 * @typedef {object} User
 * @param {string} _id Id for the user
 * @param {[string]} stars Stars for the user
 * @param {[Draft]} drafts
 */
/**
 * Draft for sample draft thread posts
 * @typedef {object} Draft
 * @param {string} _id Id for the draft
 * @param {string} content Content for the draft
 * @param {string} title Title for the draft
 * @param {[string]} tags Tags Content for the draft
 * @param {Date} dateTime Date for the post
 */

/**
 * Report model for threads and replies
 * @typedef {object} Report
 * @param {string} _id Id for report
 * @param {string} userId Id for the reporting user
 * @param {number} reportReason Number representing the report reason
 * @param {string} description Description for the report
 */

/**
 * Thread
 * @typedef {object} Thread
 * @param {string} _id Id for the thread
 * @param {string} content Content for the thread
 * @param {string} title Title for the thread
 * @param {[string]} tags  tags for the thread
 * @param {Date} dateTime Date on which the thread was posted
 * @param {Date} lastUpdate Date on which the thread was last updated
 * @param {number} stars Count of total number of stars
 * @param {number} upvotesCount Id for the thread
 * @param {number} downvotesCount Id for the thread
 * @param {[string]} [upvotes] Contains only one id for the user currently logged in this field is not returned
 * if user is not logged in
 * @param {[string]} [downvotes] Contains only one id for the user currently logged in this field is not returned
 * if user is not logged in
 */

/**
 * Reply
 * @typedef {object} Reply
 * @param {string} _id Id for the reply
 * @param {string} content Content for the reply
 * @param {string} title Title for the reply
 * @param {[string]} tags  tags for the reply
 * @param {Date} dateTime Date on which the reply was posted
 * @param {Date} lastUpdate Date on which the reply was last updated
 * @param {number} stars Count of total number of stars
 * @param {number} upvotesCount Id for the reply
 * @param {number} downvotesCount Id for the reply
 * @param {[string]} [upvotes] Contains only one id for the user currently logged in this field is not returned
 * if user is not logged in
 * @param {[string]} [downvotes] Contains only one id for the user currently logged in this field is not returned
 * if user is not logged in
 */

/**
 * New Draft for the user
 * @function
 * @name newDraft
 * @param {string} content Content for the draft
 * @param {string} title Title for the draft
 * @param {string} tags Tags for the draft
 * @param {string} token JWT for the user
 * @return {Promise<{status:boolean, draftId:string}>}
 */
ForumClient.prototype.newDraft = draft.newDraft
/**
 *Update the draft fo the user
 * @function
 * @name updateDraft
 * @param {string} draftId
 * @param {{content?:string,title?:string,tags?:[string]}} draft
 * @param {string} token JWT
 * @return {Promise<{status:boolean, draftId:string}>}
 */
ForumClient.prototype.updateDraft = draft.updateDraft
/**
 * @function getOneDraft
 * @param {string} draftId
 * @param {string} [token]
 * @returns {Promise<{status:boolean,draft:Draft}>}
 */
ForumClient.prototype.getOneDraft = draft.getOneDraft
/**
 * @function getAllDraft
 * @param {string} [token]
 * @returns {Promise<{status:boolean,drafts:[Draft],length:int}>}
 */
ForumClient.prototype.getAllDraft = draft.getAllDraft
/**
 * @function deleteDraft
 * @param {string} draftId
 * @param {string} [token]
 * @returns {Promise<{status:boolean,draftId:string}>}
 */
ForumClient.prototype.deleteDraft = draft.deleteDraft
/**
 * @function publishDraft
 * @param {string} draftId
 * @param {string} [token]
 * @returns {Promise<{status:boolean,draftId:string,threadId:string}>}
 */
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
