import React from 'react'
import { useParams } from 'react-router-dom'

import Header from './Header'
import Description from './Description'
import Map from './Map'
import Pictures from './Pictures'
import Reviews from './Reviews'
import Cta from './Cta'
import { useTour } from '../../hooks'

const TourDetails = () => {
	const { slug } = useParams()
	const { tour, isLoading } = useTour(slug)

	console.log(tour)

	if (isLoading) return <div>Loading...</div>

	return (
		<>
			<Header tour={tour} />
			<Description tour={tour} />
			<Pictures tour={tour}/>
			<Map tour={tour}/>
			<Reviews tour={tour} />
			<Cta tour={tour} />
		</>
	)
}

export default TourDetails