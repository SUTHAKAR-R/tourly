import React from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components'
import { useTours } from '../hooks'

const Tours = () => {

	const { tours, isLoading } = useTours()

	return !isLoading && (
		<main className='main'>
			<div className='card-container'>
				{tours.map(tour => (
					<div key={tour._id} className='card'>
						<div className='card__header'>
							<div className='card__picture'>
								<div className='card__picture-overlay'>&nbsp; </div>
								<img
									src='/img/tours/tour-1-cover.jpg'
									alt='Tour 1'
									className='card__picture-img'
								/>
							</div>
							<h3 className='heading-tertirary'>
								<span>{tour.name}</span>
							</h3>
						</div>
						<div className='card__details'>
							<h4 className='card__sub-heading'>Easy {tour.duration}-day tour</h4>
							<p className='card__text'>{tour.summary}</p>
							<div className='card__data'>
								<Icon className='card__icon' name='search' />
								<span>{tour.startLocation.description}</span>
							</div>
							<div className='card__data'>
								<Icon className='card__icon' name='calendar' />
								<span>{new Date(tour.updatedAt).toDateString()}</span>
							</div>
							<div className='card__data'>
								<Icon className='card__icon' name='flag' />
								<span>{tour.locations.length} stops</span>
							</div>
							<div className='card__data'>
								<Icon className='card__icon' name='user' />
								<span>{tour.maxGroupSize} people</span>
							</div>
						</div>
						<div className='card__footer'>
							<p>
								<span className='card__footer-value'>${tour.price}</span>
								<span className='card__footer-text'>per person</span>
							</p>
							<p className='card__ratings'>
								<span className='card__footer-value'>{tour.ratingsAverage}</span>
								<span className='card__footer-text'>rating ({tour.ratingsQuantity})</span>
							</p>
							<Link to={`/${tour.slug}`} className='btn btn--green btn--small'>Details</Link>
						</div>
					</div>
				))}
			</div >
		</main >
	)
}

export default Tours