const draft = require('./draft')

const ForumClient = function () {
}

ForumClient.prototype.newDraft = draft.newDraft
ForumClient.prototype.publishDraft = draft.publishDraft
ForumClient.prototype.updateDraft = draft.updateDraft
ForumClient.prototype.getOneDraft = draft.getOneDraft

module.exports = new ForumClient()
