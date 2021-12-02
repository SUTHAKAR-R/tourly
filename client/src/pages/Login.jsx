import React from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useHistory } from 'react-router'
import { useForm, useLogin } from '../hooks'

const Login = () => {

	const { mutateAsync, isLoading } = useLogin()
	const history = useHistory()
	const { register, handleSubmit } = useForm()

	const onSubmit = async data => {
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
				<h2 className='heading-secondary ma-bt-lg'>Login</h2>
				<form className='form form--login' onSubmit={handleSubmit(onSubmit)}>
					<div className='form__group'>
						<label className='form__label'>Email</label>
						<input 
							className='form__input' 
							type='email' 
							required 
							placeholder='you@example.com' 
							{...register('email')} 
						/>
					</div>
					<div className='form__group ma-bt-md'>
						<label className='form__label'>Password</label>
						<input 
							className='form__input' 
							type='password' 
							required 
							placeholder='••••••••' 
							{...register('password')} 
						/>
					</div>
					<div className='form__group'>
						<button className='btn btn--green' disabled={isLoading}>Login</button>
					</div>
				</form>
			</div>
			<Toaster />
		</main>
	)
}

export default Login