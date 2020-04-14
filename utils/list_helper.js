const _ = require('lodash')

const totalLikes = (blogs) => {
    const reducer = (sum, item) => sum + item.likes
    return blogs.length === 0 ?
        0 : 
        blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    if(blogs.length === 0){
        return null
    }
    const fav = _.orderBy(blogs, ['likes'], ['desc'])[0]
    return {
        title: fav.title,
        author: fav.author,
        likes: fav.likes
    }
}

const mostBlogs = (blogs) => {
    if(blogs.length === 0){
        return null
    }
    const countBlogs = _.countBy(blogs, 'author')
    const max = _.max(_.toArray(countBlogs))

    return {
        author: _.invert(countBlogs)[max],
        blogs: max
    }
}

module.exports = {
    totalLikes,
    favoriteBlog,
    mostBlogs
}