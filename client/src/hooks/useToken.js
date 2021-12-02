import { useAuthState } from '../context'

export const useToken = () => {
	const { token } = useAuthState()
	return token
}