import multer from 'multer'
import sharp from 'sharp'
import { User } from 'models'
import { catchAsync, AppError } from 'utils'
import * as factory from './factory'

// const storage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		cb(null, 'pulic/img/users')
// 	},
// 	filename: (req, file, cb) => {
// 		const ext = file.mimetype.split('/')[1]
// 		cb(null, `user-${req.user._id}-${Date.now()}.${ext}`)
// 	}
// })

const storage = multer.memoryStorage()
const fileFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image')) cb(null, true)
	else cb(new AppError(400, 'Not an image file.'), false)
}
const upload = multer({ storage, fileFilter })
export const uploadUserPhoto = upload.single('photo')

export const resizeUserPhoto = catchAsync(async (req, res, next) => {
	if (!req.file) return next()
	req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`
	await sharp(req.file.buffer)
		.resize(500, 500)
		.toFormat('jpeg')
		.jpeg({ quality: 90 })
		.toFile(`public/img/users/${req.file.filename}`)
	next()
})

export const getMe = (req, res, next) => {
	req.params.id = req.user._id
	next()
}

export const updateMe = catchAsync(async (req, res, next) => { 
	const { name, email, password } = req.body
	if (password) return next(new AppError(400, 'Hit the /changePassword route to update password.'))
	const photo = req.file ? req.file.filename : 'default.jpg'
	const user = await User.findByIdAndUpdate(req.user._id, { name, email, photo }, { new: true, runValidators: true })
	res.status(200).json({
		status: 'success',
		data: {
			user
		}
	})
})

export const deleteMe = catchAsync(async (req, res, next) => { 
	await User.findOneAndUpdate({ _id: req.user._id }, { $set: { active: false } })
	res.status(204).json({
		status: 'success',
		data: null
	})
})

export const getUsers = factory.getAll(User)
export const getUser = factory.getOne(User)
export const updateUser = factory.updateOne(User)
export const deleteUser = factory.deleteOne(User)