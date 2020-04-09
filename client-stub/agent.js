const https = require('https')
const fs = require('fs')
const path = require('path')

const httpsAgent = new https.Agent({
  hostname: 'localhost',
  key: fs.readFileSync(path.join(__dirname, '../certs', 'forum-backend-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '../certs', 'forum-backend-cert.pem')),
  ca: [fs.readFileSync(path.join(__dirname, '../certs', 'CA-cert.pem'))],
  rejectUnauthorized: false
})

module.exports = httpsAgent
