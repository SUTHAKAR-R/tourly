import { Router } from 'express'
import { 
	login, 
	signup, 
	protect,
	restrictTo,
	getUser, 
	getUsers, 
	updateUser,
	deleteUser,
	getMe,
	updateMe,
	deleteMe, 
	uploadUserPhoto,
	resizeUserPhoto,
	resetPassword,
	forgotPassword,
	changePassword 
} from 'controllers'

const router = Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:userId/:resetToken', resetPassword)

router.use(protect)

router.patch('/changePassword', changePassword)
router.get('/me', getMe, getUser)
router.put('/updateMe', uploadUserPhoto, resizeUserPhoto, updateMe)
router.delete('/deleteMe', deleteMe)

router.use(restrictTo('admin'))

router
	.route('/')
	.get(getUsers)

router
	.route('/:id')
	.get(getUser)
	.delete(deleteUser)
	.patch(updateUser)

export default router