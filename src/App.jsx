import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Login from './pages/login';
import Signup from './pages/signup';
import Auth from './pages/auth';
import Dashboard from './pages/dashboard';
import Startups from './pages/startups';
import Policies from './pages/policies';
import StatusTracking from './pages/StatusTracking';
import Expenses from './pages/expenses';
import Reports from './pages/reports';
import Layout from './components/Layout';
import ProtectedRoute from './components/protectedroute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth" element={<Auth />} />

        <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="startups" element={<Startups />} />
          <Route path="policies" element={<Policies />} />
          <Route path="status" element={<StatusTracking />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
