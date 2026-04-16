import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Payments from './pages/Payments';
import MyProfile from './pages/MyProfile';
import Welcome from './pages/Welcome';
import Email from './pages/Email';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) return <Navigate to="/welcome" />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="text-center mt-5">
        <h2 className="text-danger fw-bold">403 - Access Restricted</h2>
        <p>You do not have permission to view this page.</p>
        <button className="btn btn-primary mt-3" onClick={() => window.history.back()}>Go Back</button>
      </div>
    );
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="App bg-light" style={{ minHeight: '100vh' }}>
        <AppNavbar />
        <div className="container py-4" style={{ marginTop: '56px' }}>
          <Routes>
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            
            {/* ADMIN Routes */}
            <Route path="/" element={<PrivateRoute allowedRoles={['ADMIN']}><Dashboard /></PrivateRoute>} />
            <Route path="/members" element={<PrivateRoute allowedRoles={['ADMIN']}><Members /></PrivateRoute>} />
            <Route path="/payments" element={<PrivateRoute allowedRoles={['ADMIN']}><Payments /></PrivateRoute>} />
            <Route path="/email" element={<PrivateRoute allowedRoles={['ADMIN']}><Email /></PrivateRoute>} />
            
            {/* MEMBER Routes */}
            <Route path="/profile" element={<PrivateRoute allowedRoles={['ADMIN', 'MEMBER']}><MyProfile /></PrivateRoute>} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="colored" />
    </Router>
  );
}

export default App;
