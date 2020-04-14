const config = require('./utils/config')
const express = require('express')
const app = express()
const blogRouter = require('./controllers/blogRouter')
const userRouter = require('./controllers/userRouter')
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
require('express-async-errors')

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
app.use('/api/users', userRouter)

logger.info('router loaded')

module.exports = app