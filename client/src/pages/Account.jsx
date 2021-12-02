import React from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { Icon } from '../components'
import { useAuthState } from '../context'
import { useForm, useUpdateUser } from '../hooks'

const Account = () => {

	const { register, handleSubmit } = useForm()
	const { mutateAsync, isLoading } = useUpdateUser()
	const { user } = useAuthState()

	const updateMe = async () => {
		const formData = new FormData(document.forms[1])
		await toast.promise(mutateAsync(formData), {
			loading: 'Updating account...',
			success: data => `Update ${data.status}`,
			error: error => `${error.message}`
		})
	}

	const changePassword = data => {

	}

	return (
		<main className='main'>
			<div className='user-view'>
				<nav className='user-view__menu'>
					<ul className='side-nav'>
						<li className='side-nav--active'><a href='#'><Icon name='settings'/>Settings</a></li>
						<li><a href='#'><Icon name='briefcase'/>My bookings</a></li>
						<li><a href='#'><Icon name='star'/>My reviews</a></li>
						<li><a href='#'><Icon name='credit-card'/>Billing</a></li>
					</ul>
					{user.role === 'admin' && (
						<div className='admin-nav'>
							<h5 className='admin-nav__heading'>Admin</h5>
							<ul className='side-nav'>
								<li><a href='#'><Icon name='map' />Manage tours</a></li>
								<li><a href='#'><Icon name='users' />Manage users</a></li>
								<li><a href='#'><Icon name='star' />Manage reviews</a></li>
								<li><a href='#'><Icon name='briefcase' />Manage bookings</a></li>
							</ul>
						</div>
					)}
				</nav>
				<div className='user-view__content'>
					<div className='user-view__form-container'>
						<h2 className='heading-secondary ma-bt-md'>Your account settings</h2>
						<form className='form form-user-data' onSubmit={handleSubmit(updateMe)}>
							<div className='form__group'>
								<label className='form__label'>Name</label>
								<input 
									className='form__input' 
									type='text' 
									required 
									name='name'
									defaultValue={user.name}
									{...register('name')}
								/>
							</div>
							<div className='form__group ma-bt-md'>
								<label className='form__label'>Email address</label>
								<input 
									className='form__input' 
									type='email' 
									required 
									name='email'
									defaultValue={user.email}
									{...register('email')}
								/>
							</div>
							<div className='form__group form__photo-upload'>
								<img className='form__user-photo' src={`/img/users/${user.photo}`} alt='User photo' />
								<input 
									className='form__upload' 
									type='file' 
									id='photo' 
									name='photo'
								/>
								<label htmlFor='photo'>Choose new photo</label>
							</div>
							<div className='form__group right'>
								<button className='btn btn--small btn--green' disabled={isLoading}>Save settings</button>
							</div>
						</form>
					</div>
					<div className='line'>&nbsp;</div>
					<div className='user-view__form-container'>
						<h2 className='heading-secondary ma-bt-md'>Password change</h2>
						<form className='form form-user-password' onSubmit={handleSubmit(changePassword)}>
							<div className='form__group'>
								<label className='form__label'>Current password</label>
								<input className='form__input' type='password' placeholder='••••••••' required />
							</div>
							<div className='form__group'>
								<label className='form__label'>New password</label>
								<input className='form__input' type='password' placeholder='••••••••' required />
							</div>
							<div className='form__group ma-bt-lg'>
								<label className='form__label'>Confirm password</label>
								<input className='form__input' type='password' placeholder='••••••••' required />
							</div>
							<div className='form__group right'>
								<button className='btn btn--small btn--green btn--save-password'>Save password</button>
							</div>
						</form>
					</div>
				</div>
			</div>
			<Toaster />
		</main>
	)
}

export default Account