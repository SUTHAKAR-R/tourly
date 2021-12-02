import jwt from 'jsonwebtoken'

export const sendToken = (user, res) => {
	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
	
	res
		.status(201)
		.cookie('jwt', token, {
			expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
			secure: false,
			httpOnly: false
		})
		.json({
			status: 'success',
			token,
			data: {
				user
			}
		})
}