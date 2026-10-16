import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Schedule from './pages/Schedule';
import AttendanceEngine from './pages/AttendanceEngine';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/attendance" element={<AttendanceEngine />} />
        <Route path="/scanner" element={<AttendanceEngine />} />
        <Route path="/leader" element={<AttendanceEngine />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Auth initialMode="login" />} />
        <Route path="/signup" element={<Auth initialMode="signup" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
