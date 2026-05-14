import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import { Toaster, toast } from 'sonner';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <>
      <Toaster position="top-right" expand={false} theme="dark" />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <main className="w-full h-full min-h-screen">
            <AppRoutes />
          </main>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}
