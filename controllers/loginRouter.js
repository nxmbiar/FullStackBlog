const loginRouter = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

loginRouter.post('/', async (request, response) => {
    const body = request.body

    const user = await User.findOne({ username: body.username })

    const passwordVerify = user === null ? 
        false : await bcrypt.compare(body.password, user.passwordHash)

    if(!user || !passwordVerify) {
        response.status(401).json({ error : 'Invalid username or password'})
    }

    let userToken = {
        username : body.username,
        id : user._id
    }
    let token = jwt.sign(userToken, process.env.SECRET)
    response.status(200).json({
        token : token,
        username : body.username,
        name : user.name
    })
})

module.exports = loginRouter