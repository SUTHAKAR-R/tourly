import React from 'react'
import { Icon } from '../../components'

const Reviews = ({ tour }) => {
	return (
		<section className='section-reviews'>
			<div className='reviews'>
				{tour.reviews.map(review => (
					<div key={review._id} className='reviews__card'>
						<div className='reviews__avatar'>
							<img
								src='img/users/default.jpg'
								alt='Jim Brown'
								className='reviews__avatar-img'
							/>
							<h6 className='reviews__user'>{review.user.name}</h6>
						</div>
						<p className='reviews__text'>
							{review.review}
						</p>
						<div className='reviews__rating'>
							{Array.from({ length: review.rating }, (_, key) => (
								<Icon key={key} className='reviews__star reviews__star--active' name='star' />
							))}
						</div>
					</div>
				))}
			</div>
		</section>
	)
}

export default Reviews