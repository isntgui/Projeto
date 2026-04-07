import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './screens/App.jsx';
import ForgetPassword from './screens/ForgetPassword.jsx';
import ResetPassword from './screens/resetPassword.jsx';
import CadasterUser from './screens/cadasterUser.jsx';
import Home from './screens/home.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/cadaster-user" element={<CadasterUser />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);