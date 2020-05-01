const router = require('express').Router()
const jwtAuth = require('../middleware/jwtAuth')
const jwtUnAuth = require('../middleware/jwtUnAuth')
const bson = require('bson')
const User = require('../modules/users/model')
const Reply = require('../modules/replies/model')
const Thread = require('../modules/threads/model')

router.get('/', jwtUnAuth, async (req, res) => {
  const userId = req.userId
  const replyId = req.query.replyId
  const response = await Reply.readReply(replyId, req.app.locals.replyCollection, userId)

  if (response.status) {
    res.status(200).json(response)
  } else if (response.err) {
    res.status(500).json(response)
  } else {
    res.status(400).json(response)
  }
})

router.post('/', jwtAuth, async (req, res) => {
  const id = req.body.id
  const reply = req.body.reply
  const user = req.user
  reply.authorName = `${user.firstName} ${user.lastName}`
  reply.author = bson.ObjectID.createFromHexString(req.userId)
  const userObject = new User({ _id: bson.ObjectID.createFromHexString(req.userId) })
  const response = await userObject.addReply(reply, id, req.app.locals.userCollection,
    req.app.locals.threadCollection, req.app.locals.replyCollection)
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
  const id = req.body.id
  const replyId = req.body.replyId
  const user = new User({ _id: bson.ObjectID.createFromHexString(userId) })
  const response = await user.deleteReply(replyId, id, req.app.locals.userCollection,
    req.app.locals.threadCollection, req.app.locals.replyCollection)
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
  const user = new User({ _id: bson.ObjectID.createFromHexString(userId) })
  reply._id = bson.ObjectID.createFromHexString(reply._id)
  const response = await Reply.updateReplyContent(reply, user._id.toHexString(), req.app.locals.replyCollection)
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
  const replyId = req.body.replyId
  await Reply.removeReplyDownvote(replyId, userId, req.app.locals.replyCollection)
  const response = await Reply.addReplyUpvote(replyId, userId, req.app.locals.replyCollection)
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
  const replyId = req.body.replyId
  await Reply.removeReplyUpvote(replyId, userId, req.app.locals.replyCollection)
  const response = await Reply.addReplyDownvote(replyId, userId, req.app.locals.replyCollection)
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
  const replyId = req.body.replyId
  const response = await Reply.removeReplyUpvote(replyId, userId, req.app.locals.replyCollection)
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
  const replyId = req.body.replyId
  const response = await Thread.removeDownvote(replyId, userId, req.app.locals.replyCollection)
  if (response.status) {
    res.status(200).json(response)
  } else if (response.err) {
    res.status(500).json(response)
  } else {
    res.status(400).json(response)
  }
})

module.exports = router
