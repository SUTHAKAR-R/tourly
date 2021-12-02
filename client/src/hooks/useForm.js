import { createRef } from 'react'

export const useForm = () => {

	const formState = {}
	const refs = {}

	const register = name => {
		const ref = createRef()
		refs[name] = ref
		return {
			ref
		}
	}

	const handleSubmit = onValid => {
		return (e) => {
			e.preventDefault && e.preventDefault()
			Object.keys(refs).forEach(field => formState[field] = refs[field].current.value)
			onValid(formState)
		}
	}

	return {
		register,
		handleSubmit
	}
}