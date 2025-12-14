import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-white">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<Dashboard />} />
      {/* Catch all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
