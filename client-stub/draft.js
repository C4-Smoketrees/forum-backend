const fetch = require('node-fetch')
const agent = require('./agent')
const url = require('./url')

async function newDraft (content, title, tags, token) {
  const res = await fetch(url + '/drafts/new', {
    method: 'POST',
    body: JSON.stringify({ draft: { content: content, tags: tags, title: title } }),
    headers: { Authorization: token, 'Content-Type': 'application/json' },
    agent
  })

  const body = await res.json()
  return body
}
async function getAllDraft(token){
  const res=await fetch(url + '/drafts/all',{
    method: 'GET',
    body: , 
    headers: {Authorization: token, 'Content-Type': 'application/json'},
    agent
  })

  const body= await res.json()
  return body
}

async function getOneDraft(token){
  const res=await fetch(url + '/drafts/one',{
    method: 'GET',
    body: ,
    headers: {Authorization: token, 'Content-Type': 'application/json'},
    agent
  })
  const body=await res.json()
  return body
}

async function publishDraft(token)
{
  const res=await fetch(url + '/drafts/publish',{
    method: 'POST',
    body: ,
    headers: {Authorization: token, 'Content-Type': 'application/json'},
    agent
  })

  const body=await res.json()
  return body
}

async function deleteDraft(token)
{
  const res=await fetch(url + '/drafts/delete',{
    method: 'POST',
    body: ,
    headers: {Authorization: token, 'Content-Type': 'application/json'},
    agent
  })

  const body=await res.json();
  return body
}
exports.newDraft = newDraft
