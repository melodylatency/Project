const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode // let isolates the variable
    let message = err.message

    // Check for bad Mongoose ObjectId
    if (err.name === "Cast Error" && err.kind === 'ObjectId') {
        message = `Resource not found`
        statusCode = 404 // if we request a nonexistant productId
    }

    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? 'Errors hidden...' : err.stack
    })
}

const notFound = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`)
    res.status(404)
    next(error)
}

export { notFound, errorHandler }