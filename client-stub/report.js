const fetch = require('node-fetch')
const agent = require('./agent')
const url = require('./url')

async function threadReport (threadId, report, token) {
  const res = await fetch(`${url}/reports/thread?threadId=${threadId}`, {
    method: 'POST',
    body: JSON.stringify({ report: report }), // { report: { reportReason: 1, description: 'lund' } }),
    headers: { 'Content-Type': 'application/json', Authorization: token },
    agent
  })
  const body = await res.json()
  return body
}

/**
 */
async function replyReport (replyId, report, token) {
  const res = await fetch(`${url}/reports/reply?replyId=${replyId}`, {
    method: 'POST',
    body: JSON.stringify({ report: report }), // ),
    headers: { 'Content-Type': 'application/json', Authorization: token },
    agent
  })
  const body = await res.json()
  return body
}

module.exports = {
  threadReport,
  replyReport
}
