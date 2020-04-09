const fetch = require('node-fetch')
const agent = require('./agent')

const url = 'https://localhost:8443'

const ForumClient = function () {
}

ForumClient.prototype.newDraft = async function (content, title, tags, token) {
  const res = await fetch(url + '/drafts/new', {
    method: 'POST',
    body: JSON.stringify({ draft: { content: content, tags: tags, title: title } }),
    headers: { Authorization: token, 'Content-Type': 'application/json' },
    agent
  })
  console.log(res.status)
  console.log(res)
  const response = await res.text()
  console.log(response)
  if (response.status) {
    return response.draftId
  }
}

module.exports = new ForumClient()
