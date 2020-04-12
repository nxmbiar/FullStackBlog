const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
        .catch(error => {
            logger.error(error)
            response.status(404).end()
        })
})

blogRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)

    blog
        .save()
        .then(result => {
            logger.info(result)
            response.status(201).json(result.toJSON())
        })
        .catch(error => {
            logger.error(error)
            response.status(400).json({ error:'Content might be missing' })
        })
})

module.exports = blogRouter