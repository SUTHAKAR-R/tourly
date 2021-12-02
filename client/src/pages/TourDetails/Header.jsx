import React from 'react'
import { Icon } from '../../components'

const Header = ({ tour }) => {

	return (
		<section className='section-header'>
			<div className='header__hero'>
				<div className='header__hero-overlay'>&nbsp;</div>
				<img className='header__hero-img' src='img/tours/tour-1-cover.jpg' />
			</div>
			<div className='heading-box'>
				<h1 className='heading-primary'>
					<span>{tour.name}</span>
				</h1>
				<div className='heading-box__group'>
					<div className='heading-box__detail'>
						<Icon className='heading-box__icon' name='clock' />
						<span className='heading-box__text'>{tour.duration} days</span>
					</div>
					<div className='heading-box__detail'>
						<Icon className='heading-box__icon' name='map-pin' />
						<span className='heading-box__text'>{tour.startLocation.description}</span>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Header