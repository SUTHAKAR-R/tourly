import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors' 
import hpp from 'hpp'
import xss from 'xss-clean'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'

import { tourRouter, userRouter } from 'routes'
import { appErrorHandler, unhandledRoutes } from 'utils'

const app = express()

const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: 'Too many requests from this IP address. Please try again in an hour.'
})

app.use('/', limiter)
app.use(helmet())
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())
app.use(mongoSanitize())
app.use(xss())
app.use(hpp({ whitelist: ['duration', 'ratingsAverage', 'ratingsAverage', 'groupSize', 'difficulty', 'price'] }))

app.use('/users', userRouter)
app.use('/tours', tourRouter)
app.all('*', unhandledRoutes)
app.use(appErrorHandler)

export default app