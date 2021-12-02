import 'dotenv/config'
import app from '@root'
import { connectDB } from 'utils'

process.on('uncaughtExeption', err => {
	console.log(err.name, err.message)
	server.close(() => process.exit(1))
})

connectDB()

const server = app.listen(process.env.PORT, async () => {
	console.log('Server listening...🚀')
})

process.on('unhandledRejection', err => {
	console.log(err.name, err.message)
	server.close(() => process.exit(1))
})