const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogRouter.get('/', async (request, response, next) => {
    try{
        const blogs = await Blog.find({})
        const blogsJSON = blogs.map(blog => blog.toJSON())
        response.json(blogsJSON)
    } catch(error) {
        logger.error(error)
        response.status(404).end()
    }
})

blogRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
    try{
        const result = await blog.save()
        logger.info(result)
        response.status(201).json(result.toJSON())
    } catch(error){
        logger.error(error)
        response.status(400).json({ error:'Content might be missing' })
    }
})

blogRouter.delete('/:id', async (request, response) => {
    try{
        let result = await Blog.findByIdAndRemove(request.params.id)
        logger.info(result)
        response.status(204).end()
    } catch(error) {
        logger.error(error)
        response.status(500).end()
    }
})

blogRouter.put('/:id', async (request, response) => {
    try{
        let newBlog = request.body
        delete newBlog.id
        let result = await Blog.findByIdAndUpdate(request.params.id, newBlog)
        response.json(result)
    } catch(error) {
        logger.error(error)
    }
})

module.exports = blogRouter