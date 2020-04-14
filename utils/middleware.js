const logger = require('./logger')

const requestLogger = (req, res, next) => {
    logger.info('Method', req.method)
    logger.info('Path:  ', req.path)
    logger.info('Body:  ', req.body)
    next()
}

const getToken = (request, response, next) => {
    const auth = request.get('Authorization')
    let token = null
    if(auth && auth.toLowerCase().startsWith('bearer')){
        token = auth.substring(7)
    }
    request['token'] = token
    next()
}

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).send({
            error: 'malformatted id'
        })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({
            error: error.message 
        })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            error: 'invalid token'
        })
    }
  
    logger.error(error.message)
  
    next(error)
}

module.exports = {
    requestLogger,
    errorHandler,
    getToken
}