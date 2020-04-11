const draft = require('./draft')

const ForumClient = function () {
}

ForumClient.prototype.newDraft = draft.newDraft

module.exports = new ForumClient()
