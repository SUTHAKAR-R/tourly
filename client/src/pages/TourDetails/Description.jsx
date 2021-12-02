import React from 'react'
import { Icon } from '../../components'

const Description = ({ tour }) => {
	return (
		<section className='section-description'>
			<div className='overview-box'>
				<div>
					<div className='overview-box__group'>
						<h2 className='heading-secondary ma-bt-lg'>Quick facts</h2>
						<div className='overview-box__detail'>
							<Icon className='overview-box__icon' name='calendar' />
							<span className='overview-box__label'>Next date</span>
							<span className='overview-box__text'>{new Date(tour.updatedAt).toDateString()}</span>
						</div>
						<div className='overview-box__detail'>
							<Icon className='overview-box__icon' name='trending-up' />
							<span className='overview-box__label'>Difficulty</span>
							<span className='overview-box__text'>{tour.difficulty}</span>
						</div>
						<div className='overview-box__detail'>
							<Icon className='overview-box__icon' name='user' />
							<span className='overview-box__label'>Participants</span>
							<span className='overview-box__text'>{tour.maxGroupSize} people</span>
						</div>
						<div className='overview-box__detail'>
							<Icon className='overview-box__icon' name='star' />
							<span className='overview-box__label'>Rating</span>
							<span className='overview-box__text'>{tour.ratingsAverage} / 5</span>
						</div>
					</div>

					<div className='overview-box__group'>
						<h2 className='heading-secondary ma-bt-lg'>Your tour guides</h2>
						{tour.guides.map(guide => (
							<div key={guide._id} className='overview-box__detail'>
								<img
									src='img/users/default.jpg'
									alt='Lead guide'
									className='overview-box__img'
								/>
								<span className='overview-box__label'>{guide.role}</span>
								<span className='overview-box__text'>{guide.name}</span>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className='description-box'>
				<h2 className='heading-secondary ma-bt-lg'>About {tour.name} tour</h2>
				<p className='description__text'>
					{tour.description}
				</p>
			</div>
		</section>
	)
}

export default Description