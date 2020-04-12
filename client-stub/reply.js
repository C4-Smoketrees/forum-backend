const fetch = require('node-fetch')
const agent = require('./agent')
const url = require('./url')

async function newReply (id, reply, token) {
  const res = await fetch(`${url}/replies`, {
    method: 'POST',
    body: JSON.stringify({ id: id, reply: reply }),
    headers: { 'Content-Type': 'application/json', Authorization: token },
    agent
  })
  const body = await res.json()
  return body
}

async function getReply (replyId, token) {
  let auth = ''
  if (token) {
    auth = token
  }
  const res = await fetch(`${url}/replies?replyId=${replyId}`, {
    method: 'GET',
    headers: { Authorization: auth },
    agent
  })
  const body = await res.json()
  return body
}

async function updateReply (replyId, content, token) {
  const res = await fetch(`${url}/replies/update`, {
    method: 'POST',
    headers: { Authorization: token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ reply: { _id: replyId, content: content } }),
    agent
  })
  const body = await res.json()
  return body
}

async function upvoteReply (replyId, token) {
  const res = await fetch(`${url}/replies/upvote`, {
    method: 'POST',
    headers: { Authorization: token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ replyId: replyId }),
    agent
  })
  const body = await res.json()
  return body
}

async function downvoteReply (replyId, token) {
  const res = await fetch(`${url}/replies/downvote`, {
    method: 'POST',
    headers: { Authorization: token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ replyId: replyId }),
    agent
  })
  const body = await res.json()
  return body
}

async function removeUpvoteReply (replyId, token) {
  const res = await fetch(`${url}/replies/removeUpvote`, {
    method: 'POST',
    headers: { Authorization: token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ replyId: replyId }),
    agent
  })
  const body = await res.json()
  return body
}

async function removeDownvoteReply (replyId, token) {
  const res = await fetch(`${url}/replies/removeDownvote`, {
    method: 'POST',
    headers: { Authorization: token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ replyId: replyId }),
    agent
  })
  const body = await res.json()
  return body
}

exports.newReply = newReply
exports.getReply = getReply
exports.updateReply = updateReply
exports.upvoteReply = upvoteReply
exports.downvoteReply = downvoteReply
exports.removeUpvoteReply = removeUpvoteReply
exports.removeDownvoteReply = removeDownvoteReply
