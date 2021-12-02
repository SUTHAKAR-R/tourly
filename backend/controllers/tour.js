import multer from 'multer'
import sharp from 'sharp'
import { Tour } from 'models'
import { AppError, catchAsync } from 'utils'
import * as factory from './factory'

const storage = multer.memoryStorage()
const fileFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image')) cb(null, true)
	else cb(new AppError(400, 'Cannot upload files other than images.'), false)
}
const upload = multer({ storage, fileFilter })
export const uploadTourImages = upload.fields([
	{ name: 'imageCover', maxCount: 1 },
	{ name: 'images', maxCount: 3 }
])

export const resizeTourImages = catchAsync(async (req, res, next) => {
	if (!req.files.imageCover || !req.files.images) return next()
	req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`
	await sharp(req.files.imageCover[0].buffer)
		.resize(2000, 1333)
		.toFormat('jpeg')
		.jpeg({ quality: 90 })
		.toFile(`public/img/tours/${req.body.imageCover}`)
	req.body.images = []
	await Promise.all(req.files.images.map(async (image, i) => {
		const fileName = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`
		await sharp(file.buffer)
			.resize(2000, 1333)
			.toFormat('jpeg')
			.jpeg({ quality: 90 })
			.toFile(`public/img/tours/${fileName}`)
		req.body.images.push(fileName)
	}))
})

export const getTours = factory.getAll(Tour)
export const getTour = factory.getOne(Tour, { path: 'reviews' })
export const createTour = factory.createOne(Tour)
export const updateTour = factory.updateOne(Tour)
export const deleteTour = factory.deleteOne(Tour)

export const getTourStats = catchAsync(async (req, res) => {
	const stats = await Tour.aggregate([
		{
			$match: { ratingsAverage: { $gte: 4.5 } }
		},
		{
			$group: {
				_id: '$difficulty',
				numTours: { $sum: 1 },
				numRatings: { $sum: '$ratingsQuantity' },
				avgRating: { $avg: '$ratingsAverage' },
				avgPrice: { $avg: '$price' },
				minPrice: { $min: '$price' },
				maxPrice: { $max: '$price' }
			}
		}
	])
	res.status(200).json({
		status: 'success',
		data: {
			stats
		}
	})
})

export const getToursWithin = catchAsync(async (req, res, next) => {
	const { distance, latlng, unit } = req.params
	const [lat, lng] = latlng.split(',')
	if (!lat || !lng) return next(new AppError(400, 'coordinates format: lat,lng'))
	const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1
	const tours = await Tour.find({ startLocation: { $geoWithin: { $centerSphere: [[lat, lng], radius] } } })
	res.status(200).json({
		status: 'success',
		results: tours.length,
		data: {
			tours
		}
	})
})

export const getDistances = catchAsync(async (req, res, next) => {
	const { latlng, unit } = req.params
	const [lat, lng] = latlng.split(',')
	if (!lat || !lng) return next(new AppError(400, 'coordinates format: lat,lng'))
	const multiplier = unit === 'mi' ? 0.000621371 : 0.001
	const distances = await Tour.aggregate([
		{
			$geoNear: {
				near: {
					type: 'Point',
					coordinates: [lng * 1, lat * 1]
				},
				distanceField: 'distance',
				distanceMultiplier: multiplier
			}
		},
		{
			$project: {
				name: 1,
				distance: 1
			}
		}
	])
	res.status(200).json({
		status: 'success',
		data: {
			distances
		}
	})
})