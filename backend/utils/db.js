import mongoose from 'mongoose'

export const connectDB = async () => {
	try {
		await mongoose.connect(process.env.DB_URI)
		console.log('connected to database...🍀')
	} catch (error) {
		console.log(error, 'could not connect database.')
	}
}