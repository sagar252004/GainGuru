import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom'
// import Navbar from './components/shared/Navbar'
import Login from './components/Login'
import Signup from './components/Signup'
import Home from './components/Home'


const appRouter = createBrowserRouter([
  {
    path: '/home',
    element: <Home />
  },
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
])

function App() {

  return (
    <div>
      <RouterProvider router={appRouter}
      future={{ v7_startTransition: true }} />
      
    </div>
  )
}

export default App