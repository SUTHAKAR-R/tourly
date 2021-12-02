import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { promisify } from 'util'
import { User, Token } from 'models'
import { AppError, catchAsync, sendToken, sendEmail } from 'utils'

export const signup = catchAsync(async (req, res, next) => {
	const { name, email, password, confirmPassword } = req.body
	const user = await User.create({
		name,
		email,
		password,
		confirmPassword
	})
	user.password = undefined
	sendToken(user, res)
})

export const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body
	if (!email || !password) return next(new AppError(400, 'Provide email and password.'))
	const user = await User.findOne({ email }).select('+password')
	if (!user) return next(new AppError(401, 'Invalid login credentials.'))
	const valid = await user.comparePassword(password, user.password)
	if (!valid) return next(new AppError(401, 'Invalid login credentials.'))
	user.password = undefined
	sendToken(user, res)
})

export const protect = catchAsync(async (req, res, next) => {
	const authHeaders = req.headers.authorization && req.headers.authorization.startsWith('Bearer')
	if (authHeaders) {
		const token = req.headers.authorization.split(' ')[1]
		if (token) {
			const { id } = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
			const user = await User.findOne({ _id: id })
			if (!user) return next(new AppError(401, 'The user who had this token no longer exists.'))
			req.user = user
			return next()
		}
	}
	next(new AppError(401, 'You are not logged in.'))
})

export const restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) return next(new AppError(403, 'You are not authorized to do that.'))
		next()
	}
}

export const forgotPassword = catchAsync(async (req, res, next) => {
	if (!req.body.email) return next(new AppError(400, 'Email is required to reset the password.'))
	const user = await User.findOne({ email: req.body.email })
	if (!user) return next(new AppError(404, 'User does not exist.'))
	let token = await Token.findOne({ userId: user._id });
	if (token) {
		await token.deleteOne()
	}
	const resetToken = crypto.randomBytes(32).toString('hex')
	await Token.create({
		userId: user._id,
		passworResetToken: await bcrypt.hash(resetToken, 12)
	})
	const link = `${process.env.BASE}/users/resetPassword/${user._id}/${resetToken}`
	await sendEmail({ to: user.email, subject: 'Password Reset', text: link })
	res.status(200).json({
		status: 'success',
		message: 'Check the password reset link at your registerd email address.'
	})
})

export const resetPassword = catchAsync(async (req, res, next) => {
	const { userId, resetToken } = req.params
	const { password } = req.body
	const token = await Token.findOne({ userId })
	if(!token) return next(new AppError(400, 'Link has expired or invalid link.')) 
	const isValid = await bcrypt.compare(resetToken, token.passworResetToken)
	if (!isValid) next(new AppError(400, 'Link has expired or invalid link.'))
	if (!req.body.password) next(new AppError(400, 'You need to send a new password along with the reset link.'))
	const user = await User.findById(userId)
	user.password = password
	await user.save({ validateBeforeSave: false })
	res.status(200).json({
		status: 'success',
		message: 'Password reset successful. Login again to continue.'
	})
})

export const changePassword = catchAsync(async (req, res, next) => {
	const user = await User.findOne({ _id: req.user._id }).select('+password')
	if (!await user.comparePassword(req.body.currentPassword, user.password)) return next(new AppError(401, 'Your current password is wrong.' ))
	user.password = req.body.password
	user.confirmPassword = req.body.confirmPassword
	await user.save()
	sendToken(user, res)
})