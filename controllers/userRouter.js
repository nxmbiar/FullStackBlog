const userRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')
const bcrypt = require('bcrypt')

userRouter.get('/', async (request, response, next) => {
    try{
        const users = await User.find({}).populate('blogs', { title: 1, likes: 1 })
        const usersJSON = users.map(user => user.toJSON())
        response.json(usersJSON)
    } catch(error) {
        logger.error(error)
        response.status(404).end()
    }
})

userRouter.post('/', async (request, response) => {
    const body = request.body
    if(body.password.length < 3){
        logger.error('Password less tahn 3 characters long')
        response.status(400).json({error: 'Password should be atleast 3 characters long'})
    }
    const passwordHash = await bcrypt.hash(body.password, 10)
    const user = new User({
        username: body.username,
        name: body.name,
        blogs: body.blogs,
        passwordHash: passwordHash
    })
    try{
        const result = await user.save()
        logger.info(result)
        response.status(201).json(result.toJSON())
    } catch(error){
        logger.error(error)
        response.status(400).json({ error: error.message })
    }
})

userRouter.delete('/:id', async (request, response) => {
    try{
        let result = await User.findByIdAndRemove(request.params.id)
        logger.info(result)
        response.status(204).end()
    } catch(error) {
        logger.error(error)
        response.status(500).end()
    }
})

userRouter.put('/:id', async (request, response) => {
    try{
        let newUser = request.body
        delete newUser.id
        let result = await User.findByIdAndUpdate(request.params.id, newUser)
        response.json(result)
    } catch(error) {
        logger.error(error)
    }
})

module.exports = userRouter