import React, { createContext, useContext, useEffect } from 'react'
import { useImmerReducer } from 'use-immer'

const AuthState = createContext()
const AuthDispatch = createContext()

const initialState = {
	loggedIn: Boolean(localStorage.getItem('token')),
	token: localStorage.getItem('token'),
	user: {
		...JSON.parse(localStorage.getItem('user'))
	}
}

const reducer = (draft, { type, payload }) => {
	switch (type) {
		case 'LOGIN':
			draft.loggedIn = true
			draft.token = payload.token
			draft.user = payload.data.user
			break

		case 'UPDATE':
			draft.user = payload.data.user
			break

		case 'LOGOUT': 
			draft.loggedIn = false
			draft.token = null
			draft.user = null
			break
	
		default:
			break
	}
}

export const AuthProvider = ({ children }) => {

	const [state, dispatch] = useImmerReducer(reducer, initialState)

	useEffect(() => {
		if (state.loggedIn) {
			localStorage.setItem('token', state.token)
			localStorage.setItem('user', JSON.stringify(state.user))
		} else {
			localStorage.removeItem('token')
			localStorage.removeItem('user')
		}
	}, [state.loggedIn, state.user])

	return (
		<AuthState.Provider value={state}>
			<AuthDispatch.Provider value={dispatch}>
				{children}
			</AuthDispatch.Provider>
		</AuthState.Provider>
	)
}

export const useAuthState = () => {
	const { loggedIn, token, user } = useContext(AuthState)
	return { loggedIn, token, user }
}

export const useAuthDispatch = () => useContext(AuthDispatch)