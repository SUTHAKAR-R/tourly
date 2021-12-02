import mongoose from 'mongoose'
import slugify from 'slugify'

const TourSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Tour needs a name.'],
		unique: true,
		trim: true,
		minlength: [10, 'Tour name cannot be less than 10 characters.'],
		maxlength: [50, 'Tour name cannot be more than 50 characters.']
	},
	slug: {
		type: String,
	},
	duration: {
		type: Number,
		required: [true, 'Tour needs a duration.']
	},
	maxGroupSize: {
		type: Number,
		required: [true, 'Tour needs a group size.']
	},
	difficulty: {
		type: String,
		required: [true, 'Tour needs a difficulty.'],
		enum: {
			values: ['easy', 'medium', 'difficult'],
			message: 'Difficulty is either: easy, medium or difficult.'
		}
	}, 
	ratingsQuantity: {
		type: Number,
		default: 0
	},
	ratingsAverage: {
		type: Number,
		min: [1, 'Rating must be above 1.0'],
		max: [5, 'Rating must be above 5.0'],
		default: 4.5,
		set: val => Math.round(val * 10) / 10
	},
	price: {
		type: Number,
		required: [true, 'Tour needs a price.']
	},
	summary: {
		type: String,
		required: [true, 'Tour needs a summary.'],
		trim: true
	},
	description: {
		type: String,
		trim: true
	},
	imageCover: {
		type: String,
		required: [true, 'Tour needs a cover.']
	},
	images: [String],
	startDates: [Date],
	startLocation: {
		type: {
			type: String,
			default: 'Point',
			enum: ['Point']
		},
		coordinates: [Number],
		address: String,
		description: String
	},
	locations: [{
		type: {
			type: String,
			default: 'Point',
			enum: ['Point']
		},
		coordinates: [Number],
		address: String,
		description: String,
		day: Number
	}],
	guides: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	}]
}, 
{ 
	timestamps: true, 
	toJSON: { virtuals: true }, 
	toObject: { virtuals: true } 
})

TourSchema.index({ slug: 1 })
TourSchema.index({ startLocation: '2dsphere' })

TourSchema.virtual('durationWeeks').get(function () {
	return this.duration / 7
})

TourSchema.pre('save', function(next) {
	this.slug = slugify(this.name, { lower: true })
	next()
})

TourSchema.virtual('reviews', {
	ref: 'review',
	foreignField: 'tour',
	localField: '_id'
})

TourSchema.pre(/^find/, function(next) {
	this.populate({
		path: 'guides',
		select: '-__v'
	})
	next()
})

const Tour = mongoose.model('tour', TourSchema)

export default Tour