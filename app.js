const app = require('express')()
const MongoClient = require('mongodb').MongoClient

const compression = require('compression')
const sanitizer = require('express-sanitizer')
const parser = require('body-parser')
const cors = require('cors')
const morgan = require('./logging/morgan')

// Connect to the database
const dbConnectionString = 'mongodb://localhost:27017' || process.env.DB_CONN_STRING
const dbConn = async () => {
  try {
    const dbPromise = MongoClient.connect(dbConnectionString, { useUnifiedTopology: true })
    app.locals.dbClient = await dbPromise
    app.locals.db = await app.locals.dbClient.db('forum')
    app.locals.threadCollection = await app.locals.db.collection('threads')
    app.locals.replyCollection = await app.locals.db.collection('replies')
    app.locals.userCollection = await app.locals.db.collection('users')
    app.locals.tagCollection = await app.locals.db.collection('tags')
    await app.locals.threadCollection.createIndex({ content: 'text', title: 'text' })
  } catch (e) {
    console.log('-------')
    console.log(e)
    process.exit(2)
  }
}
dbConn().then(() => {})

// Middlewares
app.use(sanitizer())
app.use(parser.json())
app.use(compression())
app.use(cors())

// Logging
app.use('/drafts', require('./routes/draft'))
app.use('/threads', require('./routes/thread'))
app.use('/reports', require('./routes/report'))
app.use('/replies', require('./routes/reply'))

app.use('*', function (req, res) {
  res.status(400).json({ status: false, message: 'Resource Not found' })
})

app.use(morgan)

// Define routes

module.exports = app
