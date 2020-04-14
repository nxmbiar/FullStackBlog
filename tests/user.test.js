const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('../utils/blog_helper')


const api = supertest(app)

// beforeEach(async () => {
//     await Blog.deleteMany({})

//     for(let blog of helper.initialBlogs) {
//         let blogObject = new Blog(blog)
//         await blogObject.save()
//     }
// })

describe('api_post', () => {
    test('add existing user', async () => {
        const usersStart = await helper.usersInDB()

        const newUser = {
            username: 'anant',
            name: 'Anant1234',
            password: 'secret',
            blogs: []
        }

        let result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        
        expect(result.body.error).toContain('`username` to be unique')
        
        const usersEnd = await helper.usersInDB()
        expect(usersEnd.length).toBe(usersStart.length)
        
    })

    test('add invalid username', async () => {
        const usersStart = await helper.usersInDB()

        const newUser = {
            username: 'ab',
            name: 'Anant test',
            password: 'ab123',
            blogs: []
        }

        let result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        
        expect(result.body.error).toContain('shorter than the minimum allowed length')
        
        const usersEnd = await helper.usersInDB()
        expect(usersEnd.length).toBe(usersStart.length)
        
    })

    test('add invalid password', async () => {
        const usersStart = await helper.usersInDB()

        const newUser = {
            username: 'ab123',
            name: 'Anant test',
            password: 'ab',
            blogs: []
        }

        let result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        
        expect(result.body.error).toContain('Password should be atleast 3 characters long')
        
        const usersEnd = await helper.usersInDB()
        expect(usersEnd.length).toBe(usersStart.length)
        
    })
})

afterAll(() => {
    mongoose.connection.close()
})