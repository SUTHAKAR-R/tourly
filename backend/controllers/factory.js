import { QueryFeatures, AppError, catchAsync } from 'utils'

export const getAll = Model => catchAsync(async (req, res, next) => {
	let filter = {}
	if (req.params.tourId) filter = { tour: req.params.tourId }
	const features = new QueryFeatures(Model.find(filter), req.query).filter().sort().limitFields().paginate()
	const docs = await features.query.populate({ path: 'reviews' })
	res.status(200).json({
		status: 'success',
		results: docs.length,
		data: {
			docs
		}
	})
})

export const getOne = (Model, popOps) => catchAsync(async (req, res, next) => {
	let query = req.params.slug ? Model.findOne({ slug: req.params.slug }) : Model.findById(req.params.id)
	if (popOps) query = query.populate(popOps)
	let doc = await query
	if (!doc) return next(new AppError(404, 'That document does not exist.'))
	res.status(200).json({
		status: 'success',
		data: {
			doc
		}
	})
})

export const createOne = Model => catchAsync(async (req, res, next) => {
	const doc = await Model.create(req.body)
	res.status(201).json({
		status: 'success',
		data: {
			doc
		}
	})
})

export const updateOne = Model => catchAsync(async (req, res, next) => {
	const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
	if (!doc) return next(new AppError(404, 'That document does not exist.'))
	res.status(200).json({
		status: 'success',
		data: {
			doc
		}
	})
})

export const deleteOne = Model => catchAsync(async (req, res, next) => {
	const doc = await Model.findByIdAndDelete(req.params.id)
	if (!doc) return next(new AppError(404, 'That document does not exist.'))
	res.status(204).json({
		status: 'success',
		data: null
	})
})