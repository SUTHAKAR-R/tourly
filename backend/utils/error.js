export class AppError extends Error {
	constructor(statusCode, message) {
		super(message)
		this.statusCode = statusCode || 500
		this.status = String(this.statusCode).startsWith('4') ? 'fail' : 'error'
		this.isOperationalError = true
		Error.captureStackTrace(this, this.constructor)
	}
}

const formatError = err => {
	if (err.name === 'CastError') return new AppError(400, `Invalid ${err.path}: ${err.value}`)
	if (err.code === 11000) return new AppError(400, 'Duplicate key.')
	if (err.name === 'ValidationError') {
		const errors = Object.values(err.errors).map(val => val.message)
		return new AppError(400, `${errors.join(' ')}`)
	}
	if (err.name === 'JsonWebTokenError') return new AppError(401, err.message)
	if (err.name === 'TokenExpiredError') return new AppError(401, err.message)
}

export const appErrorHandler = (err, req, res, next) => {
	if (err.isOperationalError) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message
		})
	} else {
		const error = formatError(err)
		const statusCode = error?.statusCode || 500
		res.status(statusCode).json({
			status: error?.status || 'error',
			message: error?.message || err.message
		})
	}
}

export const catchAsync = fn => {
	return (req, res, next) => {
		fn(req, res, next).catch(next)
	}
}

export const unhandledRoutes = (req, res, next) => {
	next(new AppError(404, `Invalid url: ${req.originalUrl}`))
}