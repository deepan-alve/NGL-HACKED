/**
 * Main Application Router
 * 
 * Simple router for NGL clone - dashboard is hidden from regular users
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import SecurityDashboard from './components/SecurityDashboard';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        {/* Hidden admin route - only accessible via direct URL */}
        <Route path="/admin/security-dashboard-2024" element={<SecurityDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
