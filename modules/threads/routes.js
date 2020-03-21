const router = require('express').Router()

router.get('/new', (req, res) => {
  res.status(200).send('hi')
})

module.exports = router
