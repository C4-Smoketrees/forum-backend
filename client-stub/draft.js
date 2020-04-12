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
    headers: {Authorization: token, 'Content-Type': 'application/json'},
    agent
  })

  const body= await res.json()
  return body
}

async function getOneDraft(draftId,token){
  const res=await fetch(url + '/drafts/one?draftId='+draftId,{
    method: 'GET',
    headers: {Authorization: token, 'Content-Type': 'application/json'},
    agent
  })
  const body=await res.json()
  return body
}

async function publishDraft(draftId,token)
{
  const res=await fetch(url + '/drafts/publish?draftId='+draftId,{
    method: 'POST',
    headers: {Authorization: token, 'Content-Type': 'application/json'},
    agent
  })

  const body=await res.json()
  return body
}

async function deleteDraft(draftId,token)
{
  const res=await fetch(url + '/drafts/delete?draftId='+draftId,{
    method: 'POST',
    headers: {Authorization: token, 'Content-Type': 'application/json'},
    agent
  })

  const body=await res.json();
  return body
}
exports.newDraft = newDraft
exports.getAllDraft=getAllDraft
exports.getOneDraft=getOneDraft
exports.publishDraft=publishDraft
exports.deleteDraft=deleteDraft