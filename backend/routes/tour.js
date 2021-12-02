import { Router } from 'express'
import { createTour, updateTour, deleteTour, getTour, getTours, getTourStats, getToursWithin, getDistances, protect, restrictTo, uploadTourImages, resizeTourImages } from 'controllers'
import reviewRouter from './review'

const router = Router()

router.get('/stats', getTourStats)
router.use('/:tourId/reviews', reviewRouter)

router
	.route('/tours-within/:distance/center/:latlng/unit/:unit')
	.get(getToursWithin)

router
	.route('/distances/:latlng/unit/:unit')
	.get(getDistances)

router
	.route('/')
	.get(getTours)
	.post(protect, restrictTo('admin', 'lead-guide'), createTour)

router
	.route('/:slug')
	.get(getTour)
	.patch(protect, restrictTo('admin', 'lead-guide'), uploadTourImages, resizeTourImages, updateTour)
	.delete(protect, restrictTo('admin', 'lead-guide'), deleteTour)

export default router