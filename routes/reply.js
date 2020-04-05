const router = require('express').Router()
const jwtAuth = require('../middleware/jwtAuth')
const jwtUnAuth = require('../middleware/jwtUnAuth')
const bson = require('bson')
const User = require('../modules/users/model')
const Reply = require('../modules/replies/model')
const Thread = require('../modules/threads/model')

router.post('thread/reply', jwtAuth, async (req, res) => {
  const userId = req.userId
  const threadId = req.body.threadId
  const reply = req.body.reply
  const user = new User({ _id: bson.ObjectID.createFromHexString(userId) })
  const response = await user.addReply(reply, threadId, req.app.locals.userCollection, req.app.locals.threadCollection)
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
  const replyId = req.body.replyId
  const user = new User({ _id: bson.ObjectID.createFromHexString(userId) })
  const response = await user.deleteReply(replyId, threadId, req.app.locals.userCollection, req.app.locals.threadCollection)
  if (response.status) {
    res.status(200).json(response)
  } else if (response.err) {
    res.status(500).json(response)
  } else {
    res.status(400).json(response)
  }
})

router.post('/update', jwtAuth, async (req, res) => {
  const userId = req.userId
  const reply = req.body.reply
  const threadId = req.body.threadId
  const user = new User({ _id: bson.ObjectID.createFromHexString(userId) })
  reply._id = bson.ObjectID.createFromHexString(reply._id)
  const response = await Reply.updateReplyContent(reply, threadId, user._id.toHexString(), req.app.locals.threadCollection)
  if (response.status) {
    res.status(200).json(response)
  } else if (response.err) {
    res.status(500).json(response)
  } else {
    res.status(400).json(response)
  }
})

router.post('/upvote', jwtAuth, async (req, res) => {
  const userId = req.userId
  const threadId = req.body._id
  const replyId = req.body.replyId
  await Reply.removeReplyDownvote(replyId, threadId, userId, req.app.locals.threadCollection)
  const response = await Reply.addReplyUpvote(replyId, threadId, userId, req.app.locals.threadCollection)
  if (response.status) {
    res.status(200).json(response)
  } else if (response.err) {
    res.status(500).json(response)
  } else {
    res.status(400).json(response)
  }
})

router.post('/downvote', jwtAuth, async (req, res) => {
  const userId = req.userId
  const threadId = req.body._id
  const replyId = req.body.replyId
  await Reply.removeReplyUpvote(replyId, threadId, userId, req.app.locals.threadCollection)
  const response = await Reply.addReplyDownvote(replyId, threadId, userId, req.app.locals.threadCollection)
  if (response.status) {
    res.status(200).json(response)
  } else if (response.err) {
    res.status(500).json(response)
  } else {
    res.status(400).json(response)
  }
})

router.post('/removeUpvote', jwtAuth, async (req, res) => {
  const userId = req.userId
  const threadId = req.body._id
  const replyId = req.body.replyId
  const response = await Reply.removeReplyUpvote(replyId, threadId, userId, req.app.locals.threadCollection)
  if (response.status) {
    res.status(200).json(response)
  } else if (response.err) {
    res.status(500).json(response)
  } else {
    res.status(400).json(response)
  }
})

router.post('/removeDownvote', jwtAuth, async (req, res) => {
  const userId = req.userId
  const threadId = req.body._id
  const replyId = req.body.replyId
  const response = await Thread.removeDownvote(replyId, threadId, userId, req.app.locals.threadCollection)
  if (response.status) {
    res.status(200).json(response)
  } else if (response.err) {
    res.status(500).json(response)
  } else {
    res.status(400).json(response)
  }
})

module.exports = router
