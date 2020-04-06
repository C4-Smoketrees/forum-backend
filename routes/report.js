const router = require('express').Router()
const jwtAuth = require('../middleware/jwtAuth')
const bson = require('bson')
const Report = require('../modules/reports/model')

router.post('/thread', jwtAuth, async (req, res) => {
  const userId = req.userId
  const threadId = req.query.threadId

  const report = req.body.report
  if (!report) {
    res.status(400).json({ status: false, msg: 'Report field missing' })
    return
  }
  if (!report.description) {
    report.description = ''
  }
  if (!report.reportReason) {
    res.status(400).json({ status: false, msg: 'Report reason missing' })
    return
  }

  const response = await Report.createReport(threadId, {
    reportReason: report.reportReason,
    description: report.description,
    userId: bson.ObjectId.createFromHexString(userId)
  }, req.app.locals.threadCollection)
  if (response.status) {
    res.status(200).json(response)
  } else {
    res.status(500).json(response)
  }
})

router.post('/reply', jwtAuth, async (req, res) => {
  const userId = req.userId
  const replyId = req.query.replyId

  const report = req.body.report
  if (!report) {
    res.status(400).json({ status: false, msg: 'Report field missing' })
    return
  }
  if (!report.description) {
    report.description = ''
  }
  if (!report.reportReason) {
    res.status(400).json({ status: false, msg: 'Report reason missing' })
    return
  }

  const response = await Report.createReplyReport(replyId, {
    reportReason: report.reportReason,
    description: report.description,
    userId: bson.ObjectId.createFromHexString(userId)
  }, req.app.locals.replyCollection)
  if (response.status) {
    res.status(200).json(response)
  } else {
    res.status(500).json(response)
  }
})

module.exports = router
