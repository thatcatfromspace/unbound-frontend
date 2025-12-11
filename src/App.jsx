import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Terminal from './pages/Terminal';
import Rules from './pages/admin/Rules';
import Users from './pages/admin/Users';
import Logs from './pages/admin/Logs';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/" element={<Terminal />} />
          <Route path="/admin/rules" element={<Rules />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/logs" element={<Logs />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App

