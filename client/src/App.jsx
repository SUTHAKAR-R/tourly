import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Navbar, Footer } from './components'
import { Account, Login, NotFound, Signup, Tours, TourDetails } from './pages'
import { AuthProvider } from './context'

const queryClient = new QueryClient()

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<BrowserRouter>
					<Navbar />
					<Switch>
						<Route exact path='/' component={Tours} />
						<Route exact path='/login' component={Login} />
						<Route exact path='/signup' component={Signup} />
						<Route exact path='/account' component={Account} />
						<Route path='/:slug' component={TourDetails} />
						<Route component={NotFound} />
					</Switch>
					<Footer />
				</BrowserRouter>
			</AuthProvider>
		</QueryClientProvider>
	)
}

export default App