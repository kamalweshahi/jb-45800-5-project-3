import { Navigate, Route, Routes } from 'react-router-dom'
import About from '../../about/About'
import AdminRoute from '../../auth/AdminRoute'
import Login from '../../auth/login/Login'
import ProtectedRoute from '../../auth/ProtectedRoute'
import Register from '../../auth/register/Register'
import UserRoute from '../../auth/UserRoute'
import AiRecommendation from '../../ai/AiRecommendation'
import McpConsole from '../../mcp/McpConsole'
import Reports from '../../reports/Reports'
import VacationForm from '../../vacations/vacation-form/VacationForm'
import Vacations from '../../vacations/vacations/Vacations'
import Footer from '../footer/Footer'
import Header from '../header/Header'
import NotFound from '../not-found/NotFound'

export default function Layout() {
  return (
    <div className="Layout">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/about" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<UserRoute />}>
            <Route path="/vacations" element={<Vacations />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/ai" element={<AiRecommendation />} />
            <Route path="/mcp" element={<McpConsole />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin/vacations" element={<Vacations />} />
            <Route path="/admin/vacations/new" element={<VacationForm mode="create" />} />
            <Route path="/admin/vacations/:id/edit" element={<VacationForm mode="edit" />} />
            <Route path="/admin/reports" element={<Reports />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
