const draft = require('./draft')

const ForumClient = function () {
}

ForumClient.prototype.newDraft = draft.newDraft
ForumClient.prototype.publishDraft = draft.publishDraft

module.exports = new ForumClient()
