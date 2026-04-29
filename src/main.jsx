import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// auth pages
import Login from './pages/auth/Login.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import ResetPassword from './pages/auth/ResetPassword.jsx';
import Register from './pages/auth/Register.jsx';
import CompleteProfile from './pages/auth/CompleteProfile.jsx';

// feed pages
import Feed from './pages/home/Feed.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        
        { /* Rotas de autenticação */ }
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        
        { /* Rotas do feed */ }
        <Route path="/home" element={<Feed />} />

      </Routes>
    </BrowserRouter>
  </StrictMode>
);