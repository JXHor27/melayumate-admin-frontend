import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LecturerDashboard from './pages/LecturerDashboard'
import LecturerLogin from "./pages/LecturerLogin";
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from "./context/AuthContext";
import LoadingSpinner from "./components/common/LoadingSpinner";
const ProtectedRoute = () => {
 const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    // loading for page reload
    return <LoadingSpinner />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};


function App() {
 
  return (
      <Router>
        <Routes>
         <Route path="/" element={<LecturerLogin />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<LecturerDashboard />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
