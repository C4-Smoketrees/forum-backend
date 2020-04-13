const draft = require('./draft')

const ForumClient = function () {
}

ForumClient.prototype.newDraft = draft.newDraft
ForumClient.prototype.publishDraft = draft.publishDraft
ForumClient.prototype.updateDraft = draft.updateDraft
ForumClient.prototype.getOneDraft = draft.getOneDraft
ForumClient.prototype.getAllDraft = draft.getAllDraft
ForumClient.prototype.deleteDraft = draft.deleteDraft

module.exports = new ForumClient()
