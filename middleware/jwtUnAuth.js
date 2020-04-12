const jwt = require('jsonwebtoken')
module.exports = function (req, res, next) {
  const token = req.get('Authorization')

  if (!token) {
    next()
    return
  }
  try {
    const result = jwt.verify(token, 'testsecret')
    req.userId = result._id
    next()
  } catch (e) {
    res.status(403).send('not-authorized-mofo')
  }
}
