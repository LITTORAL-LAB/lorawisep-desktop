import { createBrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  }
])
