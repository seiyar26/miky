import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TemplateEditor from './components/TemplateEditor';
import TemplateForm from './components/TemplateForm';
import History from './components/History';
import EmailSettings from './components/EmailSettings';
import EmailTemplates from './components/EmailTemplates';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="template/new" element={<TemplateEditor />} />
          <Route path="template/edit/:id" element={<TemplateEditor />} />
          <Route path="template/fill/:id" element={<TemplateForm />} />
          <Route path="history" element={<History />} />
          <Route path="email-settings" element={<EmailSettings />} />
          <Route path="email-templates" element={<EmailTemplates />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}