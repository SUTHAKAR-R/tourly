import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Icon } from '.'
import { useAuthDispatch, useAuthState } from '../context'

const Navbar = () => {

	const { loggedIn, user } = useAuthState()
	const [search, toggleSearch] = useState(false)
	const dispatch = useAuthDispatch()
	const history = useHistory()

	const logout = () => {
		dispatch({ type: 'LOGOUT' })
		history.push('/login')
	}

	return (
		<header className='header'>
			<nav className='nav nav--tours'>
				<Link to='/' className='nav__el'>All tours</Link>
				<form className='nav__search'>
					{loggedIn && (
						<>
							<button className='nav__search-btn' onClick={e => {
								e.preventDefault()
								toggleSearch(!search)
							}}>
								<Icon name='search'/>
							</button>
							{search && (
								<input
									type='text'
									placeholder='Search tours'
									className='nav__search-input'
								/>
							)}
						</>
					)}
				</form>
			</nav>
			<div className='header__logo'>
				<img src='/img/logo-white.png' alt='Natours logo' />
			</div>
			<nav className='nav nav--user'>
				{loggedIn ? (
					<>
						<button onClick={logout} className='nav__el'>Logout</button>
						<Link to='/account' className='nav__el'>
							<img src='/img/users/default.jpg' alt='User photo' className='nav__user-img' />
							<span>{user.name}</span>
						</Link>
					</>
				) : (
					<>
						<Link to='/login' className='nav__el'>Log in</Link>
						<Link to='/signup' className='nav__el nav__el--cta'>Sign up</Link>
					</>
				)}
			</nav>
		</header>
	)
}

export default Navbar