const config = require('./utils/config')
const express = require('express')
const app = express()
const blogRouter = require('./controllers/blogRouter')
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

console.log('Connecting to Db')
mongoose
    .connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(error => logger.error(error))
console.log('Connected')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogRouter)

logger.info('router loaded')

module.exports = app