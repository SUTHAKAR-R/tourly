import React from 'react'
import { useHistory } from 'react-router'
import toast, { Toaster } from 'react-hot-toast'
import { useForm, useSignup } from '../hooks'

const Signup = () => {

	const { isLoading, mutateAsync } = useSignup()
	const { register, handleSubmit } = useForm()
	const history = useHistory()

	const onSubmit = async data => {
		console.log(data)
		await toast.promise(mutateAsync(data), {
			loading: 'waiting...',
			success: data => `${data.status}`,
			error: error => `${error.message}`
		})
		history.push('/')
	}

	return (
		<main className='main'>
			<div className='login-form'>
				<h2 className='heading-secondary ma-bt-lg'>Signup</h2>
				<form className='form form--login' onSubmit={handleSubmit(onSubmit)}>
					<div className='form__group'>
						<label className='form__label'>Name</label>
						<input className='form__input' required type='text' placeholder='Jonathan Doe' {...register('name')} />
					</div>
					<div className='form__group'>
						<label className='form__label'>Email</label>
						<input className='form__input' required type='email' placeholder='you@example.com' {...register('email')} />
					</div>
					<div className='form__group ma-bt-md'>
						<label className='form__label'>Password</label>
						<input className='form__input' required type='password' placeholder='••••••••' {...register('password')} />
					</div>
					<div className='form__group ma-bt-md'>
						<label className='form__label'>Confirm Password</label>
						<input className='form__input' required type='password' placeholder='••••••••' {...register('confirmPassword')} />
					</div>
					<div className='form__group'>
						<button className='btn btn--green' disabled={isLoading}>Signup</button>
					</div>
				</form>
			</div>
			<Toaster />
		</main>
	)
}

export default Signup