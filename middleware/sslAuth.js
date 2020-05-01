module.exports = (req, res, next) => {
  if (!req.client.authorized) {
    res.status(403).json({ fuck: 'you' })
    return
  }
  next()
}
