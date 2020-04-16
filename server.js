const app = require('./app')
const https = require('https')
const fs = require('fs')
const path = require('path')
const logger = require('./logging/logger')

const PORT = process.env.PORT || 8443

const httpsOptions = {
  key: fs.readFileSync(path.resolve(process.env.SERVER_CERT_KEY)),
  cert: fs.readFileSync(path.resolve(process.env.SERVER_CERT)),
  ca: [fs.readFileSync(path.resolve(process.env.SERVER_CA))],
  requestCert: true,
  rejectUnauthorized: false
}

const server = https.createServer(httpsOptions, app)

server.listen(PORT, () => {
  logger.info(`started server on port ${PORT}`)
})
