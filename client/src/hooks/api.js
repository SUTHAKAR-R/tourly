import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useAuthDispatch } from '../context'
import { useToken } from '../hooks'

export const useSignup = () => {
	const signup = async ({ name, email, password, confirmPassword }) => {
		const response = await fetch('http://localhost:4000/users/signup', {
			method: 'post',
			headers: {
				'content-type': 'application/json',
				'credentials': 'include',
				'accept': 'application/json'
			},
			body: JSON.stringify({ name, email, password, confirmPassword })
		})
		return await response.json()
	}
	const dispatch = useAuthDispatch()
	const { mutateAsync, isLoading } = useMutation(signup, {
		onSuccess: data => {
			if (data.status === 'fail') throw new Error(data.message)
			dispatch({ type: 'LOGIN', payload: data })
		}
	})
	return { mutateAsync, isLoading }
}

export const useLogin = () => {
	const login = async ({ email, password }) => {
		const response = await fetch('http://localhost:4000/users/login', {
			method: 'post',
			headers: {
				'content-type': 'application/json',
				'credentials': 'include',
				'accept': 'application/json'
			},
			body: JSON.stringify({ email, password })
		})
		return await response.json()
	}
	const dispatch = useAuthDispatch()
	const { mutateAsync, isLoading } = useMutation(login, {
		onSuccess: data => {
			if (data.status === 'fail') throw new Error(data.message)
			dispatch({ type: 'LOGIN', payload: data })
		}
	})
	return { mutateAsync, isLoading }
}

export const useUpdateUser = () => {
	const token = useToken()
	const updateMe = async formData => {
		const response = await fetch('http://localhost:4000/users/updateMe', {
			method: 'put',
			headers: {
				'authorization': `Bearer ${token}`
			},
			body: formData
		})
		return await response.json()
	}
	const dispatch = useAuthDispatch()
	const { mutateAsync, isLoading } = useMutation(updateMe, {
		onSuccess: data => {
			if (data.status === 'fail') throw new Error(data.message)
			dispatch({ type: 'UPDATE', payload: data })
		}
	})
	return { mutateAsync, isLoading }
}

export const useTours = () => {
	const fetchTours = async () => await (await fetch('http://localhost:4000/tours')).json()
	const { data, isLoading, error } = useQuery('tours', fetchTours)
	const tours = data?.data.docs
	return { tours, isLoading, error }
}

export const useTour = slug => {
	const queryClient = useQueryClient()
	const tours = queryClient.getQueryData('tours')
	let [tour] = tours ? tours?.data.docs.filter(tour => tour.slug === slug): [null]
	if (tour) return { tour, isLoading: false }
	const fetchTour = async () => await (await fetch(`http://localhost:4000/tours/${slug}`)).json()
	const { data, isLoading } = useQuery('fetchTour', fetchTour)
	tour = data?.data.doc
	return { tour, isLoading }
}