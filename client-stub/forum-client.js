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
 * @return {Promise<{status:boolean, draftId:string,err?:error}>}
 */
ForumClient.prototype.newDraft = draft.newDraft
/**
 *Update the draft fo the user
 * @function
 * @name updateDraft
 * @param {string} draftId
 * @param {{content?:string,title?:string,tags?:[string],err?:error}} draft
 * @param {string} token JWT
 * @return {Promise<{status:boolean, draftId:string}>}
 */
ForumClient.prototype.updateDraft = draft.updateDraft
/**
 * @function getOneDraft
 * @param {string} draftId
 * @param {string} [token]
 * @returns {Promise<{status:boolean,draft:Draft,err?:error}>}
 */
ForumClient.prototype.getOneDraft = draft.getOneDraft
/**
 * @function getAllDraft
 * @param {string} [token]
 * @returns {Promise<{status:boolean,drafts:[Draft],length:int,err?:error}>}
 */
ForumClient.prototype.getAllDraft = draft.getAllDraft
/**
 * @function deleteDraft
 * @param {string} draftId
 * @param {string} [token]
 * @returns {Promise<{status:boolean,draftId:string,err?:error}>}
 */
ForumClient.prototype.deleteDraft = draft.deleteDraft
/**
 * @function publishDraft
 * @param {string} draftId
 * @param {string} [token]
 * @returns {Promise<{status:boolean,draftId:string,threadId:string,err?:error}>}
 */
ForumClient.prototype.publishDraft = draft.publishDraft

/**
 *@function getReply
 * @param {string} replyId
 * @param {string} [token] JWT
 * @return {Promise<{status:boolean,draftId:string,err?:error}>}
 */
ForumClient.prototype.getReply = reply.getReply
/**
 * @function  newReply
 * @param {{threadId?:string,replyId?:string}} id
 * @param {{content:string}} reply
 * @param {string} token
 * @return {Promise<{status:true,err?:error,replyId:string}>}
 */
ForumClient.prototype.newReply = reply.newReply
/**
 * @function  updateReply
 * @param {string} replyId
 * @param {string} reply
 * @param {string} token
 * @return {Promise<{status:true,err?:error,replyId:string}>}
 */
ForumClient.prototype.updateReply = reply.updateReply
/**
 * @function upvoteReply
 * @param {string} replyId
 * @param {string} token
 * @return {Promise<{status:boolean,err?:error}>}
 */
ForumClient.prototype.upvoteReply = reply.upvoteReply
/**
 * @function downvoteReply
 * @param {string} replyId
 * @param {string} token
 * @return {Promise<{status:boolean,err?:error}>}
 */
ForumClient.prototype.downvoteReply = reply.downvoteReply
/**
 * @function removeUpvoteReply
 * @param {string} replyId
 * @param {string} token
 * @return {Promise<{status:boolean,err?:error}>}
 */
ForumClient.prototype.removeUpvoteReply = reply.removeUpvoteReply
/**
 * @function removeDownvoteReply
 * @param {string} replyId
 * @param {string} token
 * @return {Promise<{status:boolean,err?:error}>}
 */
ForumClient.prototype.removeDownvoteReply = reply.removeDownvoteReply

/**
 * @function replyReport
 * @param replyId ReplyId
 * @param report
 * @param token
 * @return {Promise<{status:boolean,reportId:string,err?:error}>}
 */
ForumClient.prototype.replyReport = report.replyReport
/**
 * @function threadReport
 * @param threadId ThreadID
 * @param report
 * @param token
 * @return {Promise<{status:boolean,reportId:string,err?:error}>}
 */
ForumClient.prototype.threadReport = report.threadReport

/**
 * @function starThread
 * @param {string} threadId
 * @param {string} token
 * @return{Promise<{status:boolean,err?:error}>}
 */
ForumClient.prototype.starThread = thread.starThread
/**
 * @function unstarThread
 * @param {string} threadId
 * @param {string} token
 * @return{Promise<{status:boolean,err?:error}>}
 */
ForumClient.prototype.unstarThread = thread.unstarThread
/**
 * @function getOneThread
 * @param{string} threadId
 * @param {string} token
 * @return {Promise<{status:boolean,thread:Thread,err?:error}>}
 */
ForumClient.prototype.getOneThread = thread.getOneThread
/**
 * @function deleteThread
 * @param threadId
 * @parma token
 * @return {Promise<{status:boolean,thread:Thread,err?:error}>}
 */
ForumClient.prototype.deleteThread = thread.deleteThread
/**
 * @function updateThread
 * @param {string} threadId
 * @param {{content:string,title:string,tags:[string]}} thread
 * @param {string} token
 * @return {Promise<{status:boolean,threadId:string,err?:error}>}
 */
ForumClient.prototype.updateThread = thread.updateThread
/**
 * @function upvoteThread
 * @param {string} threadId
 * @param {string} token
 * @return {Promise<{status:boolean,err?:error}>}
 */
ForumClient.prototype.upvoteThread = thread.upvoteThread
/**
 * @function downvoteThread
 * @param {string} threadId
 * @param {string} token
 * @return {Promise<{status:boolean,err?:error}>}
 */
ForumClient.prototype.downvoteThread = thread.downvoteThread
/**
 * @function removeUpvoteThread
 * @param {string} threadId
 * @param {string} token
 * @return {Promise<{status:boolean,err?:error}>}
 */
ForumClient.prototype.removeUpvoteThread = thread.removeUpvoteThread
/**
 * @function removeDownvoteThread
 * @param {string} threadId
 * @param {string} token
 * @return {Promise<{status:boolean,err?:error}>}
 */
ForumClient.prototype.removeDownvoteThread = thread.removeDownvoteThread

module.exports = new ForumClient()
