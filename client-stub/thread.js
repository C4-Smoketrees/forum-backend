const fetch = require('node-fetch')
const agent = require('./agent')
const url = require('./url')

async function getOneThread (threadId, token) {
  let auth = ''
  if (token) {
    auth = token
  }
  const res = await fetch(`${url}/threads/one?threadId=${threadId}`, {
    method: 'GET',
    headers: { Authorization: auth },
    agent
  })
  const body = res.json()
  return body
}

async function getAllThread (token) {
  let auth = ''
  if (token) {
    auth = token
  }
  const res = await fetch(`${url}/threads/all`, {
    method: 'GET',
    headers: { Authorization: auth },
    agent
  })
  const body = res.json()
  return body
}

async function deleteThread (threadId, token) {
  const res = await fetch(`${url}/threads/delete`, {
    method: 'POST',
    headers: { Authorization: token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ _id: threadId }),
    agent
  })
  const body = res.json()
  return body
}

async function updateThread (threadId, thread, token) {
  const res = await fetch(`${url}/threads/update`, {
    method: 'POST',
    headers: { Authorization: token, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      thread: {
        _id: threadId,
        content: thread.content,
        title: thread.title,
        tags: thread.tags
      }
    }),
    agent
  })
  const body = await res.json()
  return body
}

async function upvoteThread (threadId, token) {
  const res = await fetch(`${url}/threads/upvote`, {
    method: 'POST',
    headers: { Authorization: token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ threadId: threadId }),
    agent
  })
  const body = await res.json()
  return body
}

async function downvoteThread (threadId, token) {
  const res = await fetch(`${url}/threads/downvote`, {
    method: 'POST',
    headers: { Authorization: token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ threadId: threadId }),
    agent
  })
  const body = await res.json()
  return body
}

async function removeUpvoteThread (threadId, token) {
  const res = await fetch(`${url}/threads/removeUpvote`, {
    method: 'POST',
    headers: { Authorization: token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ threadId: threadId }),
    agent
  })
  const body = await res.json()
  return body
}

async function removeDownvoteThread (threadId, token) {
  const res = await fetch(`${url}/threads/removeDownvote`, {
    method: 'POST',
    headers: { Authorization: token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ threadId: threadId }),
    agent
  })
  const body = await res.json()
  return body
}

async function starThread (threadId, token) {
  const res = await fetch(`${url}/threads/star`, {
    method: 'POST',
    headers: { Authorization: token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ threadId: threadId }),
    agent
  })
  const body = await res.json()
  return body
}

async function unstarThread (threadId, token) {
  const res = await fetch(`${url}/threads/unstar`, {
    method: 'POST',
    headers: { Authorization: token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ threadId: threadId }),
    agent
  })
  const body = await res.json()
  return body
}

module.exports = {
  getOneThread,
  getAllThread,
  deleteThread,
  updateThread,
  upvoteThread,
  downvoteThread,
  removeUpvoteThread,
  removeDownvoteThread,
  starThread,
  unstarThread
}
