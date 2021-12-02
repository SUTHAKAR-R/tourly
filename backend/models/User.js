import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Name is required.'],
		unique: true,
		trim: true,
		minlength: [8, 'Name must be atleast 8 characters.']
	},
	email: {
		type: String,
		required: [true, 'Email is required.'],
		unique: true,
		validate: {
			validator: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
			message: 'Email is invalid.'
		}
	},
	role: {
		type: String,
		enum: ['user', 'guide', 'lead-guide', 'admin'],
		default: 'user'
	},
	photo: {
		type: String,
		default: 'default.jpg'
	},
	password: {
		type: String,
		required: [true, 'Password is required.'],
		minlength: [8, 'Password must be atleast 8 characters.'],
		maxlength: [16, 'Password cannot be more than 16 characters.'],
		select: false
	},
	confirmPassword: {
		type: String,
		required: [true, 'Confirm Password is required.'],
		validate: {
			validator: function(val) { return val === this.password },
			message: 'Passwords must match.'
		}
	},
	active: {
		type: Boolean,
		default: true,
		select: false
	}
}, { timestamps: true })

UserSchema.pre('save', async function(next) {
	if (!this.isModified('password')) return next()
	const salt = await bcrypt.genSalt(12)
	this.password = await bcrypt.hash(this.password, salt)
	this.confirmPassword = undefined
	next()
})

UserSchema.pre(/^find/, function(next) {
	this.find({ active: true })
	next()
})

UserSchema.methods.comparePassword = async (password, hashed) => await bcrypt.compare(password, hashed)

const User = mongoose.model('user', UserSchema)

export default User