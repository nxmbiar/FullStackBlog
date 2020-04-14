const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('../utils/blog_helper')


const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})

    for(let blog of helper.initialBlogs) {
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
})

describe('api_get', () => {
    test('blogs returned', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })
})
describe('api_post', () => {
    test('add new blog', async () => {
        const newBlog = {
            title: 'Go To Statement Considered Safe',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5
        }
        
        await api.post('/api/blogs').send(newBlog)
        const blogs = await helper.blogsInDB()
        expect(blogs.length).toBe(helper.initialBlogs.length+1)      
        let blogTitles = blogs.map(blog => blog.title)
        expect(blogTitles).toContainEqual('Go To Statement Considered Safe')

    })
})

describe('api_delete', () => {
    test('delete a blog', async () => {
        let blogsBefore = await helper.blogsInDB()
        const blogToDelete = blogsBefore[0]

        await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)
        
        let blogsAfter = await helper.blogsInDB()
        expect(blogsAfter.length).toBe(blogsBefore.length-1)
        expect(blogsAfter).not.toContainEqual(blogToDelete)
    })
})

describe('api_put', () => {
    test('modify a blog', async () => {
        let blogsBefore = await helper.blogsInDB()
        const blogToDelete = blogsBefore[0]
        blogToDelete.likes += 1

        await api.put(`/api/blogs/${blogToDelete.id}`).send(blogToDelete)
        let result = (await helper.blogsInDB())[0]
        // console.log(result)
        expect(result.likes).toBe(blogToDelete.likes)
    })
})

afterAll(() => {
    mongoose.connection.close()
})