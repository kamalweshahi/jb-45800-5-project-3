import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AuthProvider from '../auth/auth/AuthProvider'
import AppErrorBoundary from '../common/error-boundary/AppErrorBoundary'
import Layout from '../layout/layout/Layout'
import '../../style.css'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <AppErrorBoundary>
        <AuthProvider>
          <Toaster position="top-right" />
          <Layout />
        </AuthProvider>
      </AppErrorBoundary>
    </BrowserRouter>
  )
}
