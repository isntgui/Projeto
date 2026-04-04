import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import EyeIcon from '../assets/eye.svg';
import EyeOffIcon from '../assets/eyeoff.svg';

function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;

    if (hash.includes('error')) {
      alert('Link inválido ou expirado. Solicite outro.');
      return;
    }

    async function handleRecovery() {
      if (hash) {
        const { error } = await supabase.auth.exchangeCodeForSession(hash);

        if (error) {
          console.error('Erro ao recuperar sessão:', error.message);
        } else {
          console.log('Sessão recuperada com sucesso!');
          window.history.replaceState({}, document.title, "/reset-password");
        }
      }
    }

    handleRecovery();
  }, []);

  async function handleNewPassword() {
    if (!password || !confirmPassword) {
      alert('Preencha todos os campos!');
      return;
    }

    if (password !== confirmPassword) {
      alert('Suas senhas estão diferentes!');
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) {
      alert('Sessão inválida ou expirada.');
      navigate('/forget-password');
      return;
    }

    const { data, error } = await supabase.auth.updateUser({ password });

    if (error) {
      alert('Erro: ' + error.message);
    } else {
      alert('Senha mudada com sucesso!');
      console.log(data);
      navigate('/');
    }
  }

  return (
    <div className="container mt-4">
      <h1>Escreva sua nova senha</h1>

      <div className="input-password-wrapper mb-2">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          className="form-control"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="eye-button btn p-0"
          style={{ background: 'transparent', border: 'none' }}
        >
          <img
            src={showPassword ? EyeOffIcon : EyeIcon}
            alt="Mostrar/Esconder senha"
            width={20}
            height={20}
          />
        </button>
      </div>

      {/* Input confirmar senha */}
      <div className="input-password-wrapper mb-2">
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirme a senha"
          className="form-control"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="eye-button btn p-0"
          style={{ background: 'transparent', border: 'none' }}
        >
          <img
            src={showConfirmPassword ? EyeOffIcon : EyeIcon}
            alt="Mostrar/Esconder senha"
            width={20}
            height={20}
          />
        </button>
      </div>

      <button
        onClick={handleNewPassword}
        className="btn btn-primary w-100 mt-2"
      >
        Nova Senha
      </button>
    </div>
  );
}

export default ResetPassword;