import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import { Tour, Review, User } from 'models'

await mongoose.connect(process.env.DB_URI)

const __dirname = path.resolve()

const tours = fs.readFileSync(`${__dirname}\\public\\tours.json`)
const reviews = fs.readFileSync(`${__dirname}\\public\\reviews.json`)
const users = fs.readFileSync(`${__dirname}\\public\\users.json`)

const importData = async () => {
	try {
		await Tour.create(JSON.parse(tours))
		await Review.create(JSON.parse(reviews))
		await User.create(JSON.parse(users))
	} catch (e) {
		console.log(e)
	}
	process.exit()
}

const deleteData = async () => {
	try {
		await Tour.deleteMany()
		await Review.deleteMany()
		await User.deleteMany()
		console.log('delete success')
	} catch (e) {
		console.log(e.name, e.message)
	}
	process.exit()
}

if (process.argv[2] === '--import') {
	importData()
}

if (process.argv[2] === '--delete') {
	deleteData()
}

// node 
	// --no-warnings 
	// --experimental-modules 
	// --es-module-specifier-resolution=node 
	// --loader ./loader.mjs 
	// public/import-dev-data.js 
	// --import or --delete