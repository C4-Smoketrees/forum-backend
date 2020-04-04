const router = require('express').Router()
const jwtAuth = require('../middleware/jwtAuth')
const User = require('../modules/users/model')
const bson = require('bson')

router.post('/new', jwtAuth, async (req, res) => {
  if (!req.body.draft.content || !req.body.draft.title || !req.body.draft.tags) {
    res.status(401).json({ msg: 'Fields missing' })
    return
  }
  const draft = req.body.draft
  const response = await User.createDraft(req.userId, draft, req.app.locals.userCollection, req.app.locals.tagCollection)
  if (response.status) {
    res.status(200).json(await response)
  } else if (response.err) {
    res.status(500).json(response)
  } else {
    res.status(400).json(response)
  }
})

router.get('/all', jwtAuth, async (req, res) => {
  const response = await User.getUser(req.userId, req.app.locals.userCollection)
  if (response.status) {
    res.status(200).json(await response)
  } else if (response.err) {
    res.status(501).json(response)
  } else {
    res.status(400).json(response)
  }
})

router.get('/one', jwtAuth, async (req, res) => {
  const response = await User.readDraft(req.userId, req.query.draftId, req.app.locals.userCollection)
  if (response.status) {
    res.status(200).json(await response)
  } else if (response.err) {
    res.status(501).json(response)
  } else {
    res.status(400).json(response)
  }
})

router.post('/update', jwtAuth, async (req, res) => {
  if (!req.body.draft) {
    res.status(401).json({ msg: 'Fields missing' })
    return
  }
  if (!req.body.draft._id) {
    res.status(401).json({ msg: 'Fields missing' })
  }
  const draft = req.body.draft
  draft._id = bson.ObjectId.createFromHexString(draft._id)
  const response = await User.updateDraft(req.userId, draft, req.app.locals.userCollection, req.app.locals.tagCollection)
  if (response.status) {
    res.status(200).json(response)
  } else if (response.err) {
    res.status(500).json(response)
  } else {
    res.status(400).json(response)
  }
})

router.post('/publish', jwtAuth, async (req, res) => {
  const response = await User.publishDraft(req.query.draftId, req.app.locals.userCollection, req.app.locals.threadCollection)
  if (response.status) {
    res.status(200).json(await response)
  } else if (response.err) {
    res.status(500).json(response)
  } else {
    res.status(400).json(response)
  }
})

router.post('/delete', jwtAuth, async (req, res) => {
  const response = await User.deleteDraft(req.userid, req.query.draftId, req.app.locals.userCollection)
  if (response.status) {
    res.status(200).json(await response)
  } else if (response.err) {
    res.status(500).json(response)
  } else {
    res.status(400).json(response)
  }
})

module.exports = router
