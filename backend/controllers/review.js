import { Review } from 'models' 
import * as factory from './factory'

export const setIds = (req, res, next) => {
	req.body.user = req.user._id
	req.body.tour = req.params.tourId
	next()
}

export const getReviews = factory.getAll(Review)
export const getReview = factory.getOne(Review)
export const createReview = factory.createOne(Review)
export const updateReview = factory.updateOne(Review)
export const deleteReview = factory.deleteOne(Review)