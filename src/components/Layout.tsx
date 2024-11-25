import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FileText, LogOut, History, Mail, Settings, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <Building2 className="w-8 h-8 text-indigo-600" />
                <span className="ml-2 text-xl font-semibold text-gray-900">
                  SARL Success CRM
                </span>
              </div>
              <div className="hidden md:flex space-x-4">
                <Link
                  to="/"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    location.pathname === '/'
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Templates
                </Link>
                <Link
                  to="/history"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    location.pathname === '/history'
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <History className="w-4 h-4 mr-2" />
                  Historique
                </Link>
                <Link
                  to="/email-templates"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    location.pathname === '/email-templates'
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Templates Email
                </Link>
                <Link
                  to="/email-settings"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    location.pathname === '/email-settings'
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres Email
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}