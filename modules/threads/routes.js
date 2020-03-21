const router = require('express').Router()
const sslAuth = require('../../middleware/sslAuth')

router.get('/new', sslAuth, (req, res) => {
  res.status(200).send('hi')
})

module.exports = router
