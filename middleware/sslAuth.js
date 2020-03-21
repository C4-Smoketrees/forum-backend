module.exports = (req, res, next) => {
  if (!req.client.authorized) {
    res.status(403).send('not-authorized-mofo')
    return
  }
  next()
}
