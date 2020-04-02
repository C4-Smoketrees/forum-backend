const app = require('express')()
const MongoClient = require('mongodb').MongoClient

const compression = require('compression')
const sanitizer = require('express-sanitizer')
const parser = require('body-parser')
const morgan = require('./logging/morgan')

// Connect to the database
const dbConnectionString = 'mongodb://localhost:27017' || process.env.DB_CONN_STRING
const dbConn = async () => {
  try {
    const dbPromise = MongoClient.connect(dbConnectionString, { useUnifiedTopology: true })
    app.locals.dbClient = await dbPromise
    app.locals.db = await app.locals.dbClient.db('forum')
    app.locals.threadCollection = await app.locals.db.collection('threads')
    app.locals.userCollection = await app.locals.db.collection('users')
    app.locals.tagCollection = await app.locals.db.collection('tags')
  } catch (e) {
    console.log(e)
    process.exit(2)
  }
}
dbConn().then(() => {})

// Middlewares
app.use(sanitizer())
app.use(parser.json())
app.use(compression())

// Logging

app.use(morgan)

// Define routes

module.exports = app
