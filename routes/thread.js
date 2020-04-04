const router = require('express').Router()
const jwtAuth = require('../middleware/jwtAuth')
const jwtUnAuth = require('../middleware/jwtUnAuth')
const bson = require('bson')
const User = require('../modules/users/model')

const Thread = require('../modules/threads/model')

router.get('/one', jwtUnAuth, async (req, res) => {
  const userId = req.userId
  const threadId = req.query.threadId
  const response = await Thread.readThreadUsingId(threadId, req.app.locals.threadCollection, userId)
  if (response.status) {
    res.status(200).json(response)
  } else if (response.err) {
    res.status(500).json(response)
  } else {
    res.status(400).json(response)
  }
})

router.get('/all', jwtUnAuth, async (req, res) => {
  const userId = req.userId
  const response = await Thread.readAllThreads(req.app.locals.threadCollection, userId)
  if (response.status) {
    res.status(200).json(response)
  } else if (response.err) {
    res.status(500).json(response)
  } else {
    res.status(400).json(response)
  }
})

router.post('/delete', jwtAuth, async (req, res) => {
  const userId = req.userId
  const threadId = req.body.threadId
  const user = new User({ _id: bson.ObjectID.createFromHexString(userId) })
  const response = await user.deleteThread(threadId, req.app.locals.userCollection, req.app.locals.threadCollection)
  if (response.status) {
    res.status(200).json(response)
  } else if (response.err) {
    res.status(500).json(response)
  } else {
    res.status(400).json(response)
  }
})

router.post('/update', jwtAuth, async (req, res) => {

})

router.post('/star', jwtAuth, async (req, res) => {

})

router.post('/upvote', jwtAuth, async (req, res) => {

})

router.post('/downvote', jwtAuth, async (req, res) => {

})

router.post('/removeUpvote', jwtAuth, async (req, res) => {

})

router.post('/removeDownvote', jwtAuth, async (req, res) => {

})

module.exports = router
