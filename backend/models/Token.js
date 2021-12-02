import mongoose from 'mongoose'

const TokenSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'user'
	},
	passworResetToken: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 3600
	}
})

const Token = mongoose.model('token', TokenSchema)

export default Token