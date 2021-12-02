export class QueryFeatures {
	constructor(query, queryParams) {
		this.query = query
		this.queryParams = queryParams
	}

	filter() {
		const filter = { ...this.queryParams }
		const excludeFields = ['sort', 'page', 'limit', 'fields']
		excludeFields.forEach(field => delete filter[field])
		this.query = this.query.find(filter)
		return this
	}

	sort() {
		if (this.queryParams.sort) {
			this.query = this.query.sort(this.queryParams.sort)
		} else {
			this.query = this.query.sort('-createdAt')
		}
		return this
	}
	
	paginate() {
		if (this.queryParams.page) {
			const page = parseInt(this.queryParams.page) || 1
			const limit = parseInt(this.queryParams.limit)
			const skip = (page - 1) * limit
			this.query = this.query.skip(skip).limit(limit)
		}
		return this
	}

	limitFields() {
		if (this.queryParams.fields) {
			const fields = this.queryParams.fields.split(',').join(' ')
			this.query = this.query.select(fields)
		} else {
			this.query = this.query.select('-__v')
		}
		return this
	}

}