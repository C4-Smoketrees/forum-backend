const router = require('express').Router()
const jwtAuth = require('../middleware/jwtAuth')
const jwtUnAuth = require('../middleware/jwtUnAuth')
const bson = require('bson')

const Thread = require('../modules/threads/model')

router.get('/one', jwtUnAuth, async (req, res) => {
  const userId = req.userId
  const threadId = req.query.threadId
  const response = await Thread.readThreadUsingId(threadId, req.app.locals.threadCollection, userId)
  if (response.status) {
    res.status(200).send(200)
  } else if (response.err) {
    res.status(500).json(response)
  } else {
    res.status(400).json(response)
  }
})

module.exports = router
