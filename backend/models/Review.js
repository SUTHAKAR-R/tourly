import mongoose from 'mongoose'
import { Tour } from 'models'

const ReviewSchema = new mongoose.Schema({
	review: {
		type: String,
		required: [true, 'Review cannot be empty.'],
		maxlength: [255, 'Review length cannot be more than 255 characters.']
	},
	rating: {
		type: Number,
		min: 1,
		max: 5
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
		required: [true, 'Review must belong to a user.']
	},
	tour: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'tour',
		required: [true, 'Review must belong to a tour.']
	}
}, 
{ 
	timestamps: true,
	toJSON: { virtuals: true },
	toObject: { virtuals: true } 
})

ReviewSchema.index({ tour: 1, user: 1 }, { unique: true })

ReviewSchema.pre(/^find/, function(next) {
	this.populate({ path: 'tour', select: 'name' }).populate({ path: 'user', select: 'name profile' })
	next()
})

ReviewSchema.statics.calcRatingsAverage = async function(tourId) {
	const [{ ratingsAverage, ratingsQuantity }] = await this.aggregate([
		{
			$match: { tour: tourId }
		},
		{
			$group: {
				_id: '$tour',
				ratingsQuantity: { $sum: 1 },
				ratingsAverage: { $avg: '$rating' }
			}
		}
	])
	if (ratingsAverage && ratingsQuantity) await Tour.findByIdAndUpdate(tourId, { ratingsAverage, ratingsQuantity })
	else await Tour.findByIdAndUpdate(tourId, { ratingsAverage: 4.5, ratingsQuantity: 0 })
}

ReviewSchema.post('save', function() {
	this.constructor.calcRatingsAverage(this.tour)
})

ReviewSchema.pre(/^findOneAnd/, async function(next) {
	this.review = await this.findOne()
	next()
})

ReviewSchema.post(/^findOneAnd/, function() {
	this.review.constructor.calcRatingsAverage(this.review.tour)
})

const Review = mongoose.model('review', ReviewSchema)

export default Review