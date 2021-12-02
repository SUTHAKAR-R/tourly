import { Router } from 'express'
import { protect, restrictTo, setIds, createReview, getReview, getReviews, updateReview, deleteReview } from 'controllers'

const router = Router({ mergeParams: true })

router.use(protect)

router
	.route('/')
	.get(getReviews)
	.post(restrictTo('user'), setIds, createReview)

router
	.route('/:id')
	.get(getReview)
	.patch(restrictTo('user', 'admin'), updateReview)
	.post(restrictTo('user', 'admin'), deleteReview)

export default router