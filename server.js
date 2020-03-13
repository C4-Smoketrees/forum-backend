const express = require('express')

const compression = require('compression')
const sanitizer = require('express-sanitizer')
const parser = require('body-parser')

// Initialise server
var app = express()

// Middlewares
app.use(sanitizer)
app.use(parser)
app.use(compression)

// Get the assigned environment port
const port = process.env.PORT || 5000

app.listen(port, () => {
  console.info(`running the forum server on ${port}`)
})
