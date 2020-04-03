const router = require('express').Router()
const jwtAuth = require('../middleware/jwtAuth')
const User = require('../modules/users/model')

router.post('/new', jwtAuth, async (req, res) => {
  if (!req.body.draft.content || !req.body.draft.title || !req.body.draft.tags) {
    res.status(401).json({ msg: 'Fields missing' })
    return
  }
  const draft = req.body.draft
  const response = await User.createDraft(req.userId, draft, req.app.locals.userCollection, req.app.locals.tagCollection)
  res.status(200).json(response)
})

module.exports = router
