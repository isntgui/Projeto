import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './screens/App.jsx';
import ForgetPassword from './screens/forgetPassword.jsx';
import ResetPassword from './screens/resetPassword.jsx';
import VerifyEmail from './screens/verifyEmail.jsx';
import Home from './screens/home.jsx';
import CadasterUser from './screens/cadasterUser.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login-page" element={<App />} />
        {/* <Route path="/" element={<App />} /> */}
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        {/* <Route path="/home-page" element={<Home />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/cadaster-page" element={<CadasterUser />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);