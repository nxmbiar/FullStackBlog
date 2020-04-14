const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')

blogRouter.get('/', async (request, response, next) => {
    try{
        const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 })
        const blogsJSON = blogs.map(blog => blog.toJSON())
        response.json(blogsJSON)
    } catch(error) {
        logger.error(error)
        response.status(404).end()
    }
})

blogRouter.post('/', async (request, response) => {
    const user = await User.findById(request.body.userId)
    console.log(user)

    const blog = new Blog({
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes,
        user: user._id
    })
    try{
        const result = await blog.save()
        logger.info(result)
        user.blogs = user.blogs.concat(result._id)
        await user.save()
        response.status(201).json(result.toJSON())
    } catch(error){
        logger.error(error)
        response.status(400).json({ error:error.message })
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